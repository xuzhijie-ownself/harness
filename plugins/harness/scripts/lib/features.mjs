/**
 * features.mjs -- feature selection with dependency resolution and stop checks.
 * Zero npm dependencies.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

function harnessDir() {
  return join(process.cwd(), '.harness');
}

export function readFeatures() {
  const raw = readFileSync(join(harnessDir(), 'features.json'), 'utf8');
  return JSON.parse(raw);
}

function readState() {
  const raw = readFileSync(join(harnessDir(), 'state.json'), 'utf8');
  return JSON.parse(raw);
}

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

export function selectNextFeature() {
  const { features } = readFeatures();
  const passMap = {};
  for (const f of features) {
    passMap[f.id] = f.passes;
  }

  const candidates = features
    .filter((f) => f.required && !f.passes)
    .map((f) => {
      const deps = f.depends_on || [];
      const unmetDeps = deps.filter((d) => !passMap[d]);
      const eligible = unmetDeps.length === 0;
      return {
        feature_id: f.id,
        title: f.title,
        priority: f.priority || 'medium',
        depends_on: deps,
        eligible,
        reason: eligible
          ? 'All dependencies met; feature is eligible.'
          : `Blocked by unmet dependencies: ${unmetDeps.join(', ')}`,
      };
    });

  const eligible = candidates
    .filter((c) => c.eligible)
    .sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1));

  if (eligible.length === 0) {
    return { feature_id: null, title: null, depends_on: [], eligible: false, reason: 'No eligible features found.' };
  }

  return eligible[0];
}

export function checkStop() {
  const { features } = readFeatures();
  const state = readState();

  const required = features.filter((f) => f.required);
  const passing = required.filter((f) => f.passes);
  const allPass = passing.length === required.length;

  const maxRetry = 3;
  const streakExceeded = state.current_failure_streak >= maxRetry;

  return {
    should_stop: allPass || streakExceeded,
    reason: allPass
      ? 'All required features pass.'
      : streakExceeded
        ? `Failure streak (${state.current_failure_streak}) reached max retry (${maxRetry}).`
        : 'Required features still failing; streak within limits.',
    required_total: required.length,
    required_passing: passing.length,
    current_failure_streak: state.current_failure_streak,
  };
}
