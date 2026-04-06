#!/usr/bin/env node

/**
 * harness-companion.mjs -- single entry point for harness mechanical tasks.
 * Zero npm dependencies. Node.js built-ins only.
 *
 * Usage: node harness-companion.mjs <subcommand> [flags]
 * Exit codes: 0 success, 1 user error, 2 system error.
 * JSON to stdout, human-readable errors to stderr.
 */

import { selectNextFeature, checkStop, updateFeature } from './lib/features.mjs';
import { readState, writeState, setPhase, incrementRound, appendCost } from './lib/state.mjs';
import { autoCommit } from './lib/git.mjs';
import { validateArtifacts, cleanupSprints } from './lib/artifacts.mjs';
import { appendProgress, updateTimestamp } from './lib/progress.mjs';
import { collectMetrics, summarizeMetrics, recordMetrics, readMetrics } from './lib/metrics.mjs';
import { logEvent, readEvents } from './lib/events.mjs';

const SUBCOMMANDS = {
  'feature-select':     'Pick the next eligible feature (highest priority, passes=false, deps met)',
  'feature-update':     'Update a feature: --id <id> [--set-passes true|false] [--set-status <s>] [--set-maturity <m>]',
  'state-mutate':       'Mutate state.json: --set-phase <phase> | --increment-round | --append-cost <json>',
  'auto-commit':        'Git commit: --feature <id> --title <text> --round <n> --status <pass|fail>',
  'validate-artifacts': 'Check sprint artifact existence: --round <n>',
  'progress-append':    'Append to progress.md: --round <n> --feature <id> --status <s> [--scores <json>] | --timestamp-only',
  'check-stop':         'Check if all required features pass or failure streak exceeded',
  'cleanup-sprints':    'Remove old sprint files: --before-round <n>',
  'metrics-summary':    'Aggregate metrics from all rounds in cost_tracking',
  'log-event':          'Log a structured event: --type <type> [--round <n>] [--feature <id>] [--data <json>]',
  'read-events':        'Read events from events.jsonl: [--type <filter>] [--since <iso-date>] [--round <n>]',
  'postmortem-data':    'Gather all postmortem data sources into a single JSON object for LLM synthesis',
};

function printHelp() {
  const lines = ['harness-companion.mjs -- subcommands:', ''];
  for (const [name, desc] of Object.entries(SUBCOMMANDS)) {
    lines.push(`  ${name.padEnd(22)} ${desc}`);
  }
  lines.push('', 'Flags: --help  Show this message');
  return lines.join('\n');
}

function parseFlags(args) {
  const flags = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--') && i + 1 < args.length && !args[i + 1].startsWith('--')) {
      flags[args[i].slice(2)] = args[i + 1];
      i++;
    } else if (args[i].startsWith('--')) {
      flags[args[i].slice(2)] = true;
    }
  }
  return flags;
}

function out(obj) {
  process.stdout.write(JSON.stringify(obj, null, 2) + '\n');
}

class UserError extends Error { constructor(msg) { super(msg); this.name = 'UserError'; } }

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help')) {
    console.log(printHelp());
    process.exit(0);
  }

  const cmd = args[0];
  const flags = parseFlags(args.slice(1));

  if (!SUBCOMMANDS[cmd]) {
    throw new UserError(`Unknown subcommand: "${cmd}". Run with --help for available commands.`);
  }

  switch (cmd) {
    case 'feature-select': {
      const result = selectNextFeature();
      out(result);
      break;
    }
    case 'feature-update': {
      if (!flags.id) {
        throw new UserError('feature-update requires --id <feature-id>');
      }
      const updates = {};
      if ('set-passes' in flags) {
        const val = flags['set-passes'];
        if (val === 'true') updates.passes = true;
        else if (val === 'false') updates.passes = false;
        else throw new UserError(`--set-passes must be "true" or "false", got "${val}".`);
      }
      if ('set-status' in flags) {
        updates.status = flags['set-status'];
      }
      if ('set-maturity' in flags) {
        updates.maturity = flags['set-maturity'];
      }
      const result = updateFeature(flags.id, updates);
      out(result);
      break;
    }
    case 'state-mutate': {
      if (flags['set-phase']) {
        const result = setPhase(flags['set-phase']);
        out(result);
      } else if (flags['increment-round']) {
        const result = incrementRound();
        out(result);
      } else if (flags['append-cost']) {
        const entry = JSON.parse(flags['append-cost']);
        const result = appendCost(entry);
        out(result);
      } else {
        throw new UserError('state-mutate requires --set-phase <phase>, --increment-round, or --append-cost <json>');
      }
      break;
    }
    case 'auto-commit': {
      if (!flags.feature || !flags.title || !flags.round || !flags.status) {
        throw new UserError('auto-commit requires --feature <id> --title <text> --round <n> --status <pass|fail>');
      }
      const result = autoCommit({
        featureId: flags.feature,
        title: flags.title,
        round: parseInt(flags.round, 10),
        status: flags.status,
      });
      out(result);
      break;
    }
    case 'validate-artifacts': {
      if (!flags.round) {
        throw new UserError('validate-artifacts requires --round <n>');
      }
      const result = validateArtifacts(parseInt(flags.round, 10));
      out(result);
      break;
    }
    case 'progress-append': {
      if (flags['timestamp-only']) {
        const result = updateTimestamp();
        out(result);
      } else if (!flags.round || !flags.feature || !flags.status) {
        throw new UserError('progress-append requires --round <n> --feature <id> --status <pass|fail> [--scores <json>] or --timestamp-only');
      } else {
        const scores = flags.scores ? JSON.parse(flags.scores) : {};
        const result = appendProgress({
          round: parseInt(flags.round, 10),
          featureId: flags.feature,
          status: flags.status,
          scores,
        });
        out(result);
      }
      break;
    }
    case 'check-stop': {
      const result = checkStop();
      out(result);
      break;
    }
    case 'cleanup-sprints': {
      if (!flags['before-round']) {
        throw new UserError('cleanup-sprints requires --before-round <n>');
      }
      const result = cleanupSprints(parseInt(flags['before-round'], 10));
      out(result);
      break;
    }
    case 'metrics-summary': {
      const result = summarizeMetrics();
      out(result);
      break;
    }
    case 'log-event': {
      if (!flags.type) {
        throw new UserError('log-event requires --type <event_type>');
      }
      const eventParams = {
        type: flags.type,
      };
      if (flags.round) eventParams.round = parseInt(flags.round, 10);
      if (flags.feature) eventParams.feature_id = flags.feature;
      if (flags.data) {
        try {
          eventParams.data = JSON.parse(flags.data);
        } catch (e) {
          throw new UserError(`--data must be valid JSON: ${e.message}`);
        }
      }
      const result = logEvent(eventParams);
      out(result);
      break;
    }
    case 'read-events': {
      const filter = {};
      if (flags.type) filter.type = flags.type;
      if (flags.since) filter.since = flags.since;
      if (flags.round) filter.round = parseInt(flags.round, 10);
      if (flags.feature) filter.feature_id = flags.feature;
      const result = readEvents(Object.keys(filter).length > 0 ? filter : undefined);
      out(result);
      break;
    }
    case 'postmortem-data': {
      const { readFileSync, readdirSync, existsSync } = await import('node:fs');
      const { join } = await import('node:path');
      const harness = join(process.cwd(), '.harness');
      const state = readState();
      const features = (await import('./lib/features.mjs')).default || JSON.parse(readFileSync(join(harness, 'features.json'), 'utf8'));
      const metrics = summarizeMetrics();
      const events = readEvents();
      const sprintsDir = join(harness, 'sprints');
      const evaluations = [];
      if (existsSync(sprintsDir)) {
        for (const f of readdirSync(sprintsDir).filter(f => f.endsWith('-evaluation.json')).sort()) {
          try { evaluations.push(JSON.parse(readFileSync(join(sprintsDir, f), 'utf8'))); } catch { /* skip malformed */ }
        }
      }
      out({
        state,
        features: JSON.parse(readFileSync(join(harness, 'features.json'), 'utf8')),
        metrics,
        events: events.events || [],
        evaluations,
        rounds_completed: state.last_completed_round || state.current_round,
      });
      break;
    }
  }
}

main().catch((err) => {
  if (err.name === 'UserError') {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
  console.error(`System error: ${err.message}`);
  process.exit(2);
});
