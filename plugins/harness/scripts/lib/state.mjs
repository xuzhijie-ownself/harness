/**
 * state.mjs -- read/write/mutate .harness/state.json with atomic writes.
 * Zero npm dependencies.
 */

import { readFileSync, writeFileSync, renameSync } from 'node:fs';
import { join } from 'node:path';

/**
 * @typedef {Object} PhaseTimestamps
 * @property {string} started_at - ISO timestamp or empty string
 * @property {string} completed_at - ISO timestamp or empty string
 */

/**
 * @typedef {Object} CostRound
 * @property {number} round
 * @property {string} started_at
 * @property {string} completed_at
 * @property {string} [feature_id]
 * @property {string} [outcome]
 * @property {{ contract: PhaseTimestamps, implementation: PhaseTimestamps, evaluation: PhaseTimestamps }} [phases]
 * @property {{ files: number, insertions: number, deletions: number }} [file_changes]
 * @property {Record<string, unknown>} [evaluation_scores]
 */

/**
 * @typedef {Object} CostTracking
 * @property {CostRound[]} rounds
 */

/**
 * @typedef {Object} StateError
 * @property {number} round
 * @property {string} agent
 * @property {string} error
 * @property {string} timestamp
 */

/**
 * @typedef {Object} StateShape
 * @property {string} mode - "continuous" | "supervised-step"
 * @property {string} status - "active" | "paused" | "complete"
 * @property {string} variant - e.g. "variant-a-sprinted"
 * @property {number} current_round
 * @property {number} last_completed_round
 * @property {string[]} active_feature_ids
 * @property {number} expected_sprint_count
 * @property {number} current_failure_streak
 * @property {number} last_feature_pass_delta
 * @property {string} stop_reason
 * @property {number} context_reset_threshold
 * @property {number} rounds_since_reset
 * @property {string} current_sprint_phase - "idle" | "contract" | "implementation" | "evaluation"
 * @property {string} domain_profile
 * @property {string} secondary_profile
 * @property {string} methodology
 * @property {StateError[]} errors
 * @property {CostTracking} cost_tracking
 */

const VALID_PHASES = ['idle', 'contract', 'implementation', 'evaluation'];

/** Required top-level fields and their expected types for state.json validation. */
const STATE_SCHEMA = {
  mode: 'string',
  status: 'string',
  variant: 'string',
  current_round: 'number',
  current_sprint_phase: 'string',
};

class UserError extends Error {
  /** @param {string} msg */
  constructor(msg) { super(msg); this.name = 'UserError'; }
}

/**
 * Return the absolute path to the .harness directory.
 * @returns {string}
 */
function harnessDir() {
  return join(process.cwd(), '.harness');
}

/**
 * Return the absolute path to state.json.
 * @returns {string}
 */
function statePath() {
  return join(harnessDir(), 'state.json');
}

/**
 * Read and validate .harness/state.json.
 * Throws UserError if required fields are missing or have wrong types.
 * @returns {StateShape}
 */
export function readState() {
  const raw = readFileSync(statePath(), 'utf8');
  const state = JSON.parse(raw);

  for (const [field, expectedType] of Object.entries(STATE_SCHEMA)) {
    if (!(field in state)) {
      throw new UserError(`state.json is missing required field "${field}".`);
    }
    if (typeof state[field] !== expectedType) {
      throw new UserError(
        `state.json field "${field}" must be ${expectedType}, got ${typeof state[field]}.`
      );
    }
  }

  return state;
}

/**
 * Atomically write state to .harness/state.json.
 * Writes to a .tmp file first, then renames for crash safety.
 * @param {StateShape} state
 * @returns {StateShape} The written state object.
 */
export function writeState(state) {
  const target = statePath();
  const tmp = target + '.tmp';
  writeFileSync(tmp, JSON.stringify(state, null, 2) + '\n', 'utf8');
  renameSync(tmp, target);
  return state;
}

/**
 * Set the current sprint phase in state.json.
 * @param {string} phase - One of "idle", "contract", "implementation", "evaluation".
 * @returns {{ ok: true, phase: string }}
 */
export function setPhase(phase) {
  if (!VALID_PHASES.includes(phase)) {
    throw new UserError(`Invalid phase: "${phase}". Must be one of: ${VALID_PHASES.join(', ')}`);
  }
  const state = readState();
  state.current_sprint_phase = phase;
  writeState(state);
  return { ok: true, phase: state.current_sprint_phase };
}

/**
 * Increment the round counter in state.json.
 * Updates current_round, last_completed_round, and rounds_since_reset.
 * @returns {{ ok: true, current_round: number, last_completed_round: number, rounds_since_reset: number }}
 */
export function incrementRound() {
  const state = readState();
  state.last_completed_round = state.current_round;
  state.current_round += 1;
  state.rounds_since_reset += 1;
  writeState(state);
  return {
    ok: true,
    current_round: state.current_round,
    last_completed_round: state.last_completed_round,
    rounds_since_reset: state.rounds_since_reset,
  };
}

/**
 * Append a cost tracking entry to state.json cost_tracking.rounds[].
 * @param {CostRound} entry
 * @returns {{ ok: true, total_entries: number }}
 */
export function appendCost(entry) {
  const state = readState();
  if (!state.cost_tracking) {
    state.cost_tracking = { rounds: [] };
  }
  state.cost_tracking.rounds.push(entry);
  writeState(state);
  return { ok: true, total_entries: state.cost_tracking.rounds.length };
}
