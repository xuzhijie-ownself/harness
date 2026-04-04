/**
 * state.mjs -- read/write/mutate .harness/state.json with atomic writes.
 * Zero npm dependencies.
 */

import { readFileSync, writeFileSync, renameSync } from 'node:fs';
import { join } from 'node:path';

const VALID_PHASES = ['idle', 'contract', 'implementation', 'evaluation'];

function harnessDir() {
  return join(process.cwd(), '.harness');
}

function statePath() {
  return join(harnessDir(), 'state.json');
}

export function readState() {
  const raw = readFileSync(statePath(), 'utf8');
  return JSON.parse(raw);
}

export function writeState(state) {
  const target = statePath();
  const tmp = target + '.tmp';
  writeFileSync(tmp, JSON.stringify(state, null, 2) + '\n', 'utf8');
  renameSync(tmp, target);
  return state;
}

export function setPhase(phase) {
  if (!VALID_PHASES.includes(phase)) {
    const err = new Error(`Invalid phase: "${phase}". Must be one of: ${VALID_PHASES.join(', ')}`);
    err.name = 'UserError';
    throw err;
  }
  const state = readState();
  state.current_sprint_phase = phase;
  writeState(state);
  return { ok: true, phase: state.current_sprint_phase };
}

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

export function appendCost(entry) {
  const state = readState();
  if (!state.cost_tracking) {
    state.cost_tracking = { rounds: [] };
  }
  state.cost_tracking.rounds.push(entry);
  writeState(state);
  return { ok: true, total_entries: state.cost_tracking.rounds.length };
}
