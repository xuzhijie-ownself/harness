/**
 * events.mjs -- structured event logging with append-only JSONL.
 * Writes to .harness/events.jsonl, one JSON object per line.
 * Zero npm dependencies.
 */

import { appendFileSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * @typedef {'agent_spawned' | 'phase_changed' | 'feature_selected' | 'evaluation_completed' | 'commit_made'} EventType
 */

/**
 * @typedef {Object} HarnessEvent
 * @property {string} timestamp - ISO 8601 timestamp
 * @property {EventType} type - Event type identifier
 * @property {number} [round] - Round number (optional)
 * @property {string} [feature_id] - Feature ID (optional)
 * @property {Record<string, unknown>} [data] - Additional event data
 */

/**
 * @typedef {Object} EventFilter
 * @property {string} [type] - Filter by event type
 * @property {string} [since] - Filter events after this ISO date
 * @property {number} [round] - Filter by round number
 * @property {string} [feature_id] - Filter by feature ID
 */

/** Valid event types. */
const VALID_EVENT_TYPES = [
  'agent_spawned',
  'phase_changed',
  'feature_selected',
  'evaluation_completed',
  'commit_made',
];

class UserError extends Error {
  /** @param {string} msg */
  constructor(msg) { super(msg); this.name = 'UserError'; }
}

/**
 * Return the absolute path to events.jsonl.
 * @returns {string}
 */
function eventsPath() {
  return join(process.cwd(), '.harness', 'events.jsonl');
}

/**
 * Log a structured event by appending a JSON line to .harness/events.jsonl.
 * Uses appendFileSync for crash-safe append-only writes (no read-modify-write).
 * @param {Object} params
 * @param {string} params.type - Event type (must be a valid EventType)
 * @param {number} [params.round] - Round number
 * @param {string} [params.feature_id] - Feature ID
 * @param {Record<string, unknown>} [params.data] - Additional event payload
 * @returns {{ ok: true, event: HarnessEvent }}
 */
export function logEvent({ type, round, feature_id, data }) {
  if (!type || typeof type !== 'string') {
    throw new UserError('logEvent requires a non-empty "type" string.');
  }

  if (!VALID_EVENT_TYPES.includes(type)) {
    throw new UserError(
      `Invalid event type: "${type}". Must be one of: ${VALID_EVENT_TYPES.join(', ')}`
    );
  }

  /** @type {HarnessEvent} */
  const event = {
    timestamp: new Date().toISOString(),
    type,
  };

  if (round !== undefined) event.round = round;
  if (feature_id !== undefined) event.feature_id = feature_id;
  if (data !== undefined) event.data = data;

  const line = JSON.stringify(event) + '\n';
  appendFileSync(eventsPath(), line, 'utf8');

  return { ok: true, event };
}

/**
 * Read events from .harness/events.jsonl with optional filtering.
 * Returns all events if no filter is provided.
 * @param {EventFilter} [filter] - Optional filter criteria
 * @returns {{ ok: true, events: HarnessEvent[], total: number }}
 */
export function readEvents(filter) {
  const filePath = eventsPath();

  if (!existsSync(filePath)) {
    return { ok: true, events: [], total: 0 };
  }

  const raw = readFileSync(filePath, 'utf8');
  const lines = raw.split('\n').filter((line) => line.trim().length > 0);

  /** @type {HarnessEvent[]} */
  let events = [];

  for (const line of lines) {
    try {
      events.push(JSON.parse(line));
    } catch {
      // Skip malformed lines
    }
  }

  // Apply filters
  if (filter) {
    if (filter.type) {
      events = events.filter((e) => e.type === filter.type);
    }
    if (filter.since) {
      const sinceDate = new Date(filter.since);
      if (isNaN(sinceDate.getTime())) {
        throw new UserError(`Invalid --since date: "${filter.since}". Must be ISO 8601 format.`);
      }
      events = events.filter((e) => new Date(e.timestamp) >= sinceDate);
    }
    if (filter.round !== undefined) {
      events = events.filter((e) => e.round === filter.round);
    }
    if (filter.feature_id) {
      events = events.filter((e) => e.feature_id === filter.feature_id);
    }
  }

  return { ok: true, events, total: events.length };
}

/**
 * Get the list of valid event types.
 * @returns {string[]}
 */
export function getValidEventTypes() {
  return [...VALID_EVENT_TYPES];
}
