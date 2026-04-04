/**
 * progress.mjs -- structured progress.md append.
 * Zero npm dependencies.
 */

import { readFileSync, writeFileSync, renameSync, existsSync } from 'node:fs';
import { join } from 'node:path';

function progressPath() {
  return join(process.cwd(), '.harness', 'progress.md');
}

/**
 * Append a structured round summary to progress.md.
 * Requires round, featureId, and status.
 */
export function appendProgress({ round, featureId, status, scores }) {
  const target = progressPath();

  if (!existsSync(target)) {
    const err = new Error('.harness/progress.md does not exist.');
    err.name = 'UserError';
    throw err;
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
 * Lightweight operation for hook use -- no round/feature context needed.
 */
export function updateTimestamp() {
  const target = progressPath();

  if (!existsSync(target)) {
    return { ok: false, reason: 'progress.md does not exist' };
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
