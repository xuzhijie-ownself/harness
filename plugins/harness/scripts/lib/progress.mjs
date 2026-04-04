/**
 * progress.mjs -- structured progress.md append and timestamp update.
 * Zero npm dependencies.
 */

import { readFileSync, writeFileSync, renameSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * @typedef {Object} AppendProgressInput
 * @property {number} round - Sprint round number
 * @property {string} featureId - Feature ID (e.g. "F-015")
 * @property {string} status - "pass" | "fail"
 * @property {Record<string, number>} [scores] - Optional score map (e.g. { product_depth: 4 })
 */

/**
 * @typedef {Object} AppendProgressResult
 * @property {boolean} ok - Always true on success
 * @property {number} round
 * @property {string} featureId
 * @property {string} status
 */

/**
 * @typedef {Object} UpdateTimestampResult
 * @property {boolean} ok - Always true on success (throws on failure)
 * @property {string} timestamp - ISO timestamp written
 */

class UserError extends Error {
  /** @param {string} msg */
  constructor(msg) { super(msg); this.name = 'UserError'; }
}

/**
 * Return the absolute path to progress.md.
 * @returns {string}
 */
function progressPath() {
  return join(process.cwd(), '.harness', 'progress.md');
}

/**
 * Append a structured round summary to progress.md.
 * Throws UserError if progress.md does not exist.
 * @param {AppendProgressInput} input
 * @returns {AppendProgressResult}
 */
export function appendProgress({ round, featureId, status, scores }) {
  const target = progressPath();

  if (!existsSync(target)) {
    throw new UserError('.harness/progress.md does not exist.');
  }

  const existing = readFileSync(target, 'utf8');

  const scoreLines = Object.entries(scores || {})
    .map(([key, val]) => `- ${key}: ${val}`)
    .join('\n');

  const timestamp = new Date().toISOString();
  const entry = [
    '',
    `## Round ${round} (${featureId}) -- ${status.toUpperCase()}`,
    `- Timestamp: ${timestamp}`,
    scoreLines || '- (no scores provided)',
    '',
  ].join('\n');

  const updated = existing.trimEnd() + '\n' + entry;
  const tmp = target + '.tmp';
  writeFileSync(tmp, updated, 'utf8');
  renameSync(tmp, target);

  return { ok: true, round, featureId, status };
}

/**
 * Update the "Last commit" timestamp in progress.md.
 * Throws UserError when progress.md is missing.
 * @returns {UpdateTimestampResult}
 */
export function updateTimestamp() {
  const target = progressPath();

  if (!existsSync(target)) {
    throw new UserError('.harness/progress.md does not exist.');
  }

  const existing = readFileSync(target, 'utf8');
  const now = new Date().toISOString();

  // Replace existing "## Last commit" section or append one
  const updated = existing.replace(/\n## Last commit\n.*$/ms, '')
    + '\n## Last commit\n- ' + now;

  const tmp = target + '.tmp';
  writeFileSync(tmp, updated, 'utf8');
  renameSync(tmp, target);

  return { ok: true, timestamp: now };
}
