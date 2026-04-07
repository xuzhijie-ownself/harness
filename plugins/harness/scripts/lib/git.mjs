/**
 * git.mjs -- auto-commit with structured messages using spawnSync args array.
 * Zero npm dependencies. Uses child_process.spawnSync (no shell string).
 */

import { spawnSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * @typedef {Object} CommitConfig
 * @property {string} commit_prefix_pass - Git commit prefix for passing rounds (default: "feat")
 * @property {string} commit_prefix_fail - Git commit prefix for failing rounds (default: "wip")
 * @property {string} commit_tag - Tag appended to commit messages (default: "[harness]")
 */

/**
 * @typedef {Object} AutoCommitInput
 * @property {string} featureId - Feature ID (e.g. "F-015")
 * @property {string} title - Human-readable title for the commit
 * @property {number} round - Sprint round number
 * @property {string} status - "pass" | "fail"
 */

/**
 * @typedef {Object} AutoCommitResult
 * @property {boolean} ok - Always true on success (throws on failure)
 * @property {string} hash - Short commit hash
 * @property {string} message - The commit message used
 */

class UserError extends Error {
  /** @param {string} msg */
  constructor(msg) { super(msg); this.name = 'UserError'; }
}

/**
 * Load .harness/config.json or return defaults.
 * @returns {CommitConfig}
 */
function loadConfig() {
  const configPath = join(process.cwd(), '.harness', 'config.json');
  if (existsSync(configPath)) {
    return JSON.parse(readFileSync(configPath, 'utf8'));
  }
  return {
    commit_prefix_pass: 'feat',
    commit_prefix_fail: 'wip',
    commit_tag: '[harness]',
  };
}

/**
 * Stage all changes and create a structured git commit.
 * Uses spawnSync with args array (no shell string) to prevent injection.
 * Throws UserError on any git failure.
 * @param {AutoCommitInput} input
 * @returns {AutoCommitResult}
 */
export function autoCommit({ featureId, title, round, status }) {
  const config = loadConfig();
  const prefix = status === 'pass' ? config.commit_prefix_pass : config.commit_prefix_fail;
  const tag = config.commit_tag || '[harness]';
  const message = `${prefix}(${featureId}): ${title} -- sprint ${round} ${tag}`;

  // Stage harness-owned paths only (not the entire working tree)
  // This prevents accidentally committing unrelated user work or secrets
  const harnessFiles = ['.harness/', 'plugins/', 'CLAUDE.md', 'README.md', 'CHANGELOG.md',
    'release.json', '.claude-plugin/', '.codex-plugin/', '.github/', 'install.sh', 'install.bat'];
  const addResult = spawnSync('git', ['add', '--', ...harnessFiles], {
    cwd: process.cwd(),
    stdio: 'pipe',
    encoding: 'utf8',
  });

  if (addResult.status !== 0) {
    throw new UserError(
      `git add failed (exit ${addResult.status}): ${addResult.stderr || addResult.stdout || 'unknown error'}`
    );
  }

  // Commit using args array (message passed as separate arg, no shell escaping needed)
  const commitResult = spawnSync('git', ['commit', '-m', message], {
    cwd: process.cwd(),
    stdio: 'pipe',
    encoding: 'utf8',
  });

  if (commitResult.status !== 0) {
    const errMsg = commitResult.stderr || commitResult.stdout || 'unknown error';
    // "nothing to commit" is a common non-error condition
    if (errMsg.includes('nothing to commit')) {
      throw new UserError(`git commit: nothing to commit (working tree clean).`);
    }
    throw new UserError(
      `git commit failed (exit ${commitResult.status}): ${errMsg}`
    );
  }

  const hashMatch = (commitResult.stdout || '').match(/\[[\w-]+ ([a-f0-9]+)\]/);
  const hash = hashMatch ? hashMatch[1] : 'unknown';

  return { ok: true, hash, message };
}
