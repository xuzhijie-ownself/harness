/**
 * features.mjs -- feature selection with dependency resolution, stop checks,
 * schema validation, and circular dependency detection.
 * Zero npm dependencies.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * @typedef {Object} Feature
 * @property {string} id - Unique feature identifier (e.g. "F-001")
 * @property {string} title - Human-readable title
 * @property {string} [category] - "functional" | "non-functional" | etc.
 * @property {string} [description]
 * @property {boolean} required - Whether this feature must pass for release
 * @property {string} [priority] - "high" | "medium" | "low"
 * @property {string} [status] - "not_started" | "in_progress" | "done"
 * @property {boolean} passes - Whether the feature currently passes evaluation
 * @property {string[]} [depends_on] - Feature IDs that must pass before this one
 * @property {string} [maturity] - "draft" | "functional" | "reviewed" | "polished" | "accepted"
 * @property {string} [source_requirement]
 * @property {string[]} [steps] - Verification steps
 * @property {string[]} [evidence]
 * @property {string} [notes]
 */

/**
 * @typedef {Object} FeaturesFile
 * @property {number} version - Schema version (must be a number)
 * @property {string} [updated_by]
 * @property {Feature[]} features - Array of feature objects
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
 * Return the absolute path to features.json.
 * @returns {string}
 */
function featuresPath() {
  return join(harnessDir(), 'features.json');
}

/**
 * Read and validate .harness/features.json.
 * Throws UserError if schema validation fails:
 * - version must be a number
 * - features must be an array
 * - each feature must have id (string), required (boolean), passes (boolean)
 * @returns {FeaturesFile}
 */
export function readFeatures() {
  const raw = readFileSync(featuresPath(), 'utf8');
  const data = JSON.parse(raw);

  if (typeof data.version !== 'number') {
    throw new UserError(
      `features.json "version" must be a number, got ${typeof data.version}.`
    );
  }

  if (!Array.isArray(data.features)) {
    throw new UserError(
      `features.json "features" must be an array, got ${typeof data.features}.`
    );
  }

  for (let i = 0; i < data.features.length; i++) {
    const f = data.features[i];
    if (typeof f.id !== 'string') {
      throw new UserError(
        `features.json features[${i}] is missing required field "id" (string).`
      );
    }
    if (typeof f.required !== 'boolean') {
      throw new UserError(
        `features.json feature "${f.id || i}" is missing required field "required" (boolean).`
      );
    }
    if (typeof f.passes !== 'boolean') {
      throw new UserError(
        `features.json feature "${f.id || i}" is missing required field "passes" (boolean).`
      );
    }
  }

  return data;
}

/**
 * Read state.json (internal helper -- uses the validated readState from state.mjs pattern).
 * @returns {import('./state.mjs').StateShape}
 */
function readState() {
  const raw = readFileSync(join(harnessDir(), 'state.json'), 'utf8');
  return JSON.parse(raw);
}

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

/**
 * Detect circular dependencies in the features dependency graph.
 * Uses DFS with a visited-set and recursion-stack approach.
 * Throws UserError if a cycle is detected, naming the cycle path.
 * @param {Feature[]} features
 */
function detectCircularDeps(features) {
  const idSet = new Set(features.map((f) => f.id));
  const adjList = {};
  for (const f of features) {
    adjList[f.id] = (f.depends_on || []).filter((d) => idSet.has(d));
  }

  const visited = new Set();
  const inStack = new Set();

  /**
   * @param {string} nodeId
   * @param {string[]} path
   */
  function dfs(nodeId, path) {
    if (inStack.has(nodeId)) {
      const cycleStart = path.indexOf(nodeId);
      const cycle = path.slice(cycleStart).concat(nodeId);
      throw new UserError(
        `Circular dependency detected: ${cycle.join(' -> ')}`
      );
    }
    if (visited.has(nodeId)) return;

    visited.add(nodeId);
    inStack.add(nodeId);
    path.push(nodeId);

    for (const dep of (adjList[nodeId] || [])) {
      dfs(dep, path);
    }

    path.pop();
    inStack.delete(nodeId);
  }

  for (const f of features) {
    if (!visited.has(f.id)) {
      dfs(f.id, []);
    }
  }
}

/**
 * Select the next eligible feature: highest priority, passes=false, required=true,
 * all depends_on features have passes=true.
 * Detects circular dependencies before selection and throws UserError if found.
 * @returns {{ feature_id: string|null, title: string|null, priority: string, depends_on: string[], eligible: boolean, reason: string }}
 */
export function selectNextFeature() {
  const { features } = readFeatures();

  // Detect circular dependencies before attempting selection
  detectCircularDeps(features);

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

/**
 * Check if all required features pass or failure streak exceeded.
 * @returns {{ should_stop: boolean, reason: string, required_total: number, required_passing: number, current_failure_streak: number, all_required_pass?: boolean }}
 */
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
    all_required_pass: allPass,
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
