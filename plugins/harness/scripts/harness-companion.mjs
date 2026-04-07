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

/** Aggregate metrics from state.json cost_tracking (used by postmortem-data only). */
function summarizeMetricsInline(state) {
  const rounds = state.cost_tracking?.rounds || [];
  let total_duration_ms = 0;
  const total_file_changes = { files_changed: 0, insertions: 0, deletions: 0 };
  const score_trends = {};
  const round_details = [];

  for (const entry of rounds) {
    let duration_ms = 0;
    if (entry.started_at && entry.completed_at) {
      duration_ms = new Date(entry.completed_at).getTime() - new Date(entry.started_at).getTime();
      if (duration_ms > 0) total_duration_ms += duration_ms;
    }
    if (entry.file_changes) {
      total_file_changes.files_changed += entry.file_changes.files_changed || 0;
      total_file_changes.insertions += entry.file_changes.insertions || 0;
      total_file_changes.deletions += entry.file_changes.deletions || 0;
    }
    if (entry.evaluation_scores) {
      for (const [criterion, data] of Object.entries(entry.evaluation_scores)) {
        if (!score_trends[criterion]) score_trends[criterion] = [];
        const score = typeof data === 'object' && data !== null && 'score' in data
          ? data.score
          : (typeof data === 'number' ? data : null);
        if (score !== null) score_trends[criterion].push(score);
      }
    }
    round_details.push({ round: entry.round, outcome: entry.outcome || '', duration_ms });
  }

  return { total_rounds: rounds.length, total_duration_ms, total_file_changes, score_trends, round_details };
}

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
      const { spawnSync } = await import('node:child_process');
      const harness = join(process.cwd(), '.harness');
      const state = readState();
      const metrics = summarizeMetricsInline(state);

      // Git log timeline for postmortem
      const gitLogResult = spawnSync('git', ['log', '--oneline', '-50'], {
        cwd: process.cwd(), stdio: 'pipe', encoding: 'utf8',
      });
      const gitTimeline = gitLogResult.status === 0 ? gitLogResult.stdout.trim().split('\n') : [];

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
        git_timeline: gitTimeline,
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
      let currentScores = null;
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
          currentScores = evalData.primary_scores || null;
        } catch {
          // eval.json missing or unreadable
        }
      }

      if (outcome) {
        roundEntry.outcome = outcome;
      }

      // Drift detection: compare current round scores vs previous round
      let drift_warning = null;
      if (currentScores && roundNum > 1) {
        try {
          const { readFileSync } = await import('node:fs');
          const { join } = await import('node:path');
          const prevPadded = String(roundNum - 1).padStart(2, '0');
          const prevPath = join(process.cwd(), '.harness', 'sprints', `${prevPadded}-eval.json`);
          const prevData = JSON.parse(readFileSync(prevPath, 'utf8'));
          const prevScores = prevData.primary_scores || {};
          const drifts = [];
          for (const [criterion, scoreObj] of Object.entries(currentScores)) {
            const curScore = typeof scoreObj === 'object' ? scoreObj.score : scoreObj;
            const prevObj = prevScores[criterion];
            const prevScore = prevObj ? (typeof prevObj === 'object' ? prevObj.score : prevObj) : null;
            if (prevScore !== null && curScore !== null && (prevScore - curScore) > 1) {
              drifts.push({ criterion, current: curScore, previous: prevScore, drop: prevScore - curScore });
            }
          }
          if (drifts.length > 0) {
            drift_warning = { message: 'Score drop >1 detected on one or more criteria', drifts };
          }
        } catch {
          // Previous eval not readable -- skip drift check
        }
      }

      writeState(state);

      const result = {
        ok: true,
        round: roundNum,
        completed_at: roundEntry.completed_at,
        outcome: roundEntry.outcome || '(not set)',
        timestamps_filled: true,
      };
      if (drift_warning) {
        result.drift_warning = drift_warning;
      }
      out(result);
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
