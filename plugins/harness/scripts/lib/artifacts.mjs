/**
 * artifacts.mjs -- sprint artifact validation and cleanup.
 * Zero npm dependencies.
 */

import { existsSync, readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

function sprintsDir() {
  return join(process.cwd(), '.harness', 'sprints');
}

function pad(n) {
  return String(n).padStart(2, '0');
}

export function validateArtifacts(round) {
  const dir = sprintsDir();
  const prefix = pad(round);
  const expected = [
    `${prefix}-contract.md`,
    `${prefix}-contract-review.md`,
    `${prefix}-builder-report.md`,
    `${prefix}-evaluation.md`,
    `${prefix}-evaluation.json`,
  ];

  const missing = [];
  for (const file of expected) {
    if (!existsSync(join(dir, file))) {
      missing.push(file);
    }
  }

  return { round, complete: missing.length === 0, missing };
}

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
