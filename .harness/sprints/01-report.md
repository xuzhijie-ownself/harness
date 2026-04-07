# Builder Report

## Metadata
- Role: generator
- Status: completed

## Target feature IDs
- F-045, F-046, F-047, F-048, F-049

## Implemented

### F-045: coordinator.md — BLOCKING language for validate-artifacts
Added explicit enforcement after step 19: "BLOCKING: If validate-artifacts reports ANY missing artifacts... STOP immediately. Do NOT continue."

### F-046: features.mjs — auto-set status to complete
Added to checkStop(): when allPass is true and status is not already complete, writes state.json with status='complete' and stop_reason. Uses atomic write (writeFileSync to .tmp then renameSync). Added writeFileSync and renameSync to imports.

### F-047: coordinator.md — handoff cleanup after resume
Added "Handoff Cleanup" subsection under Context Freshness: delete handoff.md after successful round following context reset.

### F-048: run.md — mode mismatch warning
Added warning to Preconditions: if spec says supervised but state has continuous, warn user about skipped interactive reviews.

### F-049: coordinator.md — sprint grouping respect
Added step 4 prefix: "Read sprint grouping from spec.md. Target grouped features as a batch. Do NOT split."

## Self-check
- check-stop subcommand works after F-046 change (verified)
- coordinator.md has 3 new additions (F-045, F-047, F-049)
- run.md has 1 addition (F-048)
- features.mjs has 1 code change (F-046) with atomic write pattern
