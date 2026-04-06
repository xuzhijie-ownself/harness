#!/usr/bin/env node

/**
 * harness-companion.mjs -- single entry point for harness mechanical tasks.
 * Zero npm dependencies. Node.js built-ins only.
 *
 * Usage: node harness-companion.mjs <subcommand> [flags]
 * Exit codes: 0 success, 1 user error, 2 system error.
 * JSON to stdout, human-readable errors to stderr.
 */

import { selectNextFeature, checkStop } from './lib/features.mjs';
import { readState, writeState, setPhase, incrementRound, appendCost } from './lib/state.mjs';
import { autoCommit } from './lib/git.mjs';
import { validateArtifacts, cleanupSprints } from './lib/artifacts.mjs';
import { appendProgress, updateTimestamp } from './lib/progress.mjs';
import { collectMetrics, summarizeMetrics, recordMetrics, readMetrics } from './lib/metrics.mjs';

const SUBCOMMANDS = {
  'feature-select':          'Pick the next eligible feature (highest priority, passes=false, deps met)',
  'state-mutate':            'Mutate state.json: --set-phase <phase> | --increment-round | --append-cost <json>',
  'auto-commit':             'Git commit: --feature <id> --title <text> --round <n> --status <pass|fail>',
  'validate-artifacts':      'Check sprint artifact existence: --round <n>',
  'progress-append':         'Append to progress.md: --round <n> --feature <id> --status <s> [--scores <json>] | --timestamp-only',
  'check-stop':              'Check if all required features pass or failure streak exceeded',
  'cleanup-sprints':         'Remove old sprint files: --before-round <n>',
  'postmortem-data':         'Gather all postmortem data sources into a single JSON object for LLM synthesis',
  'finalize-round':          'Fill empty cost_tracking timestamps and set outcome: --round <n> [--outcome pass|fail]',
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
    case 'postmortem-data': {
      const { readFileSync, readdirSync, existsSync } = await import('node:fs');
      const { join } = await import('node:path');
      const harness = join(process.cwd(), '.harness');
      const state = readState();
      const metrics = summarizeMetrics();
      const sprintsDir = join(harness, 'sprints');
      const evaluations = [];
      if (existsSync(sprintsDir)) {
        for (const f of readdirSync(sprintsDir).filter(f => f.endsWith('-eval.json')).sort()) {
          try { evaluations.push(JSON.parse(readFileSync(join(sprintsDir, f), 'utf8'))); } catch { /* skip malformed */ }
        }
      }
      out({
        state,
        features: JSON.parse(readFileSync(join(harness, 'features.json'), 'utf8')),
        metrics,
        evaluations,
        rounds_completed: state.last_completed_round || state.current_round,
      });
      break;
    }
    case 'finalize-round': {
      if (!flags.round) {
        throw new UserError('finalize-round requires --round <n>');
      }
      const roundNum = parseInt(flags.round, 10);
      const state = readState();
      const now = new Date().toISOString();

      // Find the target round in cost_tracking
      const roundEntry = (state.cost_tracking?.rounds || []).find(r => r.round === roundNum);
      if (!roundEntry) {
        throw new UserError(`Round ${roundNum} not found in state.json cost_tracking.rounds.`);
      }

      // Fill empty timestamps with current time
      if (!roundEntry.completed_at) roundEntry.completed_at = now;
      if (roundEntry.phases) {
        for (const phase of ['contract', 'implementation', 'evaluation']) {
          if (roundEntry.phases[phase]) {
            if (!roundEntry.phases[phase].started_at) roundEntry.phases[phase].started_at = now;
            if (!roundEntry.phases[phase].completed_at) roundEntry.phases[phase].completed_at = now;
          }
        }
      }

      // Determine outcome: try reading NN-eval.json, fall back to --outcome flag
      let outcome = flags.outcome || '';
      if (!outcome) {
        try {
          const { readFileSync } = await import('node:fs');
          const { join } = await import('node:path');
          const paddedRound = String(roundNum).padStart(2, '0');
          const evalPath = join(process.cwd(), '.harness', 'sprints', `${paddedRound}-eval.json`);
          const evalData = JSON.parse(readFileSync(evalPath, 'utf8'));
          if (evalData.decision) {
            outcome = evalData.decision.toLowerCase();
          }
        } catch {
          // eval.json missing or unreadable -- outcome stays empty unless --outcome provided
        }
      }

      if (outcome) {
        roundEntry.outcome = outcome;
      }

      writeState(state);

      out({
        ok: true,
        round: roundNum,
        completed_at: roundEntry.completed_at,
        outcome: roundEntry.outcome || '(not set)',
        timestamps_filled: true,
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
