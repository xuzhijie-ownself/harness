/**
 * git.mjs -- auto-commit with structured messages.
 * Zero npm dependencies. Uses child_process.execSync.
 */

import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

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

export function autoCommit({ featureId, title, round, status }) {
  const config = loadConfig();
  const prefix = status === 'pass' ? config.commit_prefix_pass : config.commit_prefix_fail;
  const tag = config.commit_tag || '[harness]';
  const message = `${prefix}(${featureId}): ${title} -- sprint ${round} ${tag}`;

  try {
    execSync('git add -A', { cwd: process.cwd(), stdio: 'pipe' });
    const result = execSync(`git commit -m "${message.replace(/"/g, '\\"')}"`, {
      cwd: process.cwd(),
      stdio: 'pipe',
      encoding: 'utf8',
    });
    const hashMatch = result.match(/\[[\w-]+ ([a-f0-9]+)\]/);
    const hash = hashMatch ? hashMatch[1] : 'unknown';
    return { ok: true, hash, message };
  } catch (err) {
    return { ok: false, error: err.message || String(err) };
  }
}
