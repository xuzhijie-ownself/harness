/**
 * artifacts.mjs -- sprint artifact validation and cleanup.
 * Zero npm dependencies.
 */

import { existsSync, readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

/**
 * @typedef {Object} ValidateResult
 * @property {number} round - The round number validated
 * @property {boolean} complete - True if all expected artifacts exist
 * @property {string[]} missing - List of missing artifact filenames
 */

/**
 * @typedef {Object} CleanupResult
 * @property {string[]} removed - List of removed filenames
 */

/**
 * Return the absolute path to the sprints directory.
 * @returns {string}
 */
function sprintsDir() {
  return join(process.cwd(), '.harness', 'sprints');
}

/**
 * Zero-pad a number to 2 digits.
 * @param {number} n
 * @returns {string}
 */
function pad(n) {
  return String(n).padStart(2, '0');
}

/**
 * Validate that all expected sprint artifacts exist for a given round.
 * Expected artifacts: NN-proposal.md, NN-review.md, NN-report.md,
 * NN-eval.md, NN-eval.json.
 * @param {number} round - The round number to validate
 * @returns {ValidateResult}
 */
export function validateArtifacts(round) {
  const dir = sprintsDir();
  const prefix = pad(round);
  const expected = [
    `${prefix}-proposal.md`,
    `${prefix}-review.md`,
    `${prefix}-report.md`,
    `${prefix}-eval.md`,
    `${prefix}-eval.json`,
  ];

  const missing = [];
  for (const file of expected) {
    if (!existsSync(join(dir, file))) {
      missing.push(file);
    }
  }

  return { round, complete: missing.length === 0, missing };
}

/**
 * Remove sprint artifact files for rounds before the specified round number.
 * @param {number} beforeRound - Remove files for rounds strictly less than this number
 * @returns {CleanupResult}
 */
export function cleanupSprints(beforeRound) {
  const dir = sprintsDir();
  if (!existsSync(dir)) {
    return { removed: [] };
  }

  const files = readdirSync(dir);
  const removed = [];

  for (const file of files) {
    const match = file.match(/^(\d+)-/);
    if (match) {
      const fileRound = parseInt(match[1], 10);
      if (fileRound < beforeRound) {
        unlinkSync(join(dir, file));
        removed.push(file);
      }
    }
  }

  return { removed };
}
