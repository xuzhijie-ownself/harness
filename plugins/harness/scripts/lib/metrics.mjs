/**
 * metrics.mjs -- per-round metrics collection and aggregation.
 * Reads git diff stats and evaluation scores, writes to cost_tracking.
 * Zero npm dependencies.
 */

import { spawnSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { readState, writeState } from './state.mjs';

/**
 * @typedef {Object} FileChanges
 * @property {number} files_changed - Number of files changed
 * @property {number} insertions - Lines inserted
 * @property {number} deletions - Lines deleted
 */

/**
 * @typedef {Object} CollectedMetrics
 * @property {number} round - The round number
 * @property {FileChanges} file_changes - Git diff stats
 * @property {Record<string, unknown>} evaluation_scores - Scores from evaluation JSON
 */

/**
 * @typedef {Object} MetricsSummary
 * @property {number} total_rounds - Number of tracked rounds
 * @property {number} total_duration_ms - Sum of round durations in milliseconds
 * @property {FileChanges} total_file_changes - Aggregated file change totals
 * @property {Record<string, number[]>} score_trends - Per-criterion score arrays across rounds
 * @property {{ round: number, outcome: string, duration_ms: number }[]} round_details - Per-round summaries
 */

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
 * Parse git diff --shortstat output into structured file changes.
 * Handles variations like:
 *   "3 files changed, 100 insertions(+), 20 deletions(-)"
 *   "1 file changed, 5 insertions(+)"
 *   "2 files changed, 10 deletions(-)"
 * @param {string} raw - Raw output from git diff --shortstat
 * @returns {FileChanges}
 */
function parseShortstat(raw) {
  const filesMatch = raw.match(/(\d+)\s+files?\s+changed/);
  const insMatch = raw.match(/(\d+)\s+insertions?\(\+\)/);
  const delMatch = raw.match(/(\d+)\s+deletions?\(-\)/);

  return {
    files_changed: filesMatch ? parseInt(filesMatch[1], 10) : 0,
    insertions: insMatch ? parseInt(insMatch[1], 10) : 0,
    deletions: delMatch ? parseInt(delMatch[1], 10) : 0,
  };
}

/**
 * Get file change stats from git diff --shortstat.
 * Compares HEAD~1 to HEAD. Returns zeros if git command fails or no prior commit.
 * @returns {FileChanges}
 */
function getGitFileChanges() {
  const result = spawnSync('git', ['diff', '--shortstat', 'HEAD~1', 'HEAD'], {
    cwd: process.cwd(),
    stdio: 'pipe',
    encoding: 'utf8',
  });

  if (result.status !== 0 || !result.stdout) {
    return { files_changed: 0, insertions: 0, deletions: 0 };
  }

  return parseShortstat(result.stdout);
}

/**
 * Read evaluation scores from the round's evaluation JSON file.
 * @param {number} round - The round number
 * @returns {Record<string, unknown>} The primary_scores object, or empty object if not found
 */
function getEvaluationScores(round) {
  const prefix = String(round).padStart(2, '0');
  const evalPath = join(harnessDir(), 'sprints', `${prefix}-evaluation.json`);

  if (!existsSync(evalPath)) {
    return {};
  }

  try {
    const data = JSON.parse(readFileSync(evalPath, 'utf8'));
    return data.primary_scores || {};
  } catch {
    return {};
  }
}

/**
 * Collect metrics for a given round: git file changes and evaluation scores.
 * @param {number} round - The round number to collect metrics for
 * @returns {CollectedMetrics}
 */
export function collectMetrics(round) {
  const file_changes = getGitFileChanges();
  const evaluation_scores = getEvaluationScores(round);

  return {
    round,
    file_changes,
    evaluation_scores,
  };
}

/**
 * Record collected metrics into the cost_tracking entry for a given round in state.json.
 * Finds the matching round entry and adds file_changes and evaluation_scores fields.
 * @param {number} round - The round number
 * @param {CollectedMetrics} metrics - The collected metrics
 * @returns {{ ok: true, round: number }}
 */
export function recordMetrics(round, metrics) {
  const state = readState();

  if (!state.cost_tracking || !state.cost_tracking.rounds) {
    throw new UserError('state.json cost_tracking.rounds is missing.');
  }

  const entry = state.cost_tracking.rounds.find((r) => r.round === round);
  if (!entry) {
    throw new UserError(`No cost_tracking entry found for round ${round}.`);
  }

  entry.file_changes = metrics.file_changes;
  entry.evaluation_scores = metrics.evaluation_scores;

  writeState(state);
  return { ok: true, round };
}

/**
 * Read metrics for a specific round from state.json cost_tracking.
 * @param {number} round - The round number
 * @returns {{ round: number, file_changes: FileChanges|undefined, evaluation_scores: Record<string,unknown>|undefined, started_at: string, completed_at: string }}
 */
export function readMetrics(round) {
  const state = readState();
  const entry = (state.cost_tracking?.rounds || []).find((r) => r.round === round);

  if (!entry) {
    throw new UserError(`No cost_tracking entry found for round ${round}.`);
  }

  return {
    round: entry.round,
    file_changes: entry.file_changes,
    evaluation_scores: entry.evaluation_scores,
    started_at: entry.started_at || '',
    completed_at: entry.completed_at || '',
  };
}

/**
 * Summarize metrics across all rounds in state.json cost_tracking.
 * Aggregates total rounds, duration, file changes, and score trends.
 * @returns {MetricsSummary}
 */
export function summarizeMetrics() {
  const state = readState();
  const rounds = state.cost_tracking?.rounds || [];

  let total_duration_ms = 0;
  const total_file_changes = { files_changed: 0, insertions: 0, deletions: 0 };
  /** @type {Record<string, number[]>} */
  const score_trends = {};
  const round_details = [];

  for (const entry of rounds) {
    // Duration
    let duration_ms = 0;
    if (entry.started_at && entry.completed_at) {
      duration_ms = new Date(entry.completed_at).getTime() - new Date(entry.started_at).getTime();
      if (duration_ms > 0) total_duration_ms += duration_ms;
    }

    // File changes
    if (entry.file_changes) {
      total_file_changes.files_changed += entry.file_changes.files_changed || 0;
      total_file_changes.insertions += entry.file_changes.insertions || 0;
      total_file_changes.deletions += entry.file_changes.deletions || 0;
    }

    // Score trends
    if (entry.evaluation_scores) {
      for (const [criterion, data] of Object.entries(entry.evaluation_scores)) {
        if (!score_trends[criterion]) score_trends[criterion] = [];
        const score = typeof data === 'object' && data !== null && 'score' in data
          ? data.score
          : (typeof data === 'number' ? data : null);
        if (score !== null) score_trends[criterion].push(score);
      }
    }

    round_details.push({
      round: entry.round,
      outcome: entry.outcome || '',
      duration_ms,
    });
  }

  return {
    total_rounds: rounds.length,
    total_duration_ms,
    total_file_changes,
    score_trends,
    round_details,
  };
}
