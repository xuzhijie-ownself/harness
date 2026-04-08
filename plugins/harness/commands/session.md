---
name: session
description: "Run one supervised sprint round for a harness project. Selects the next failing required feature, negotiates a sprint contract with user and evaluator review, implements it, and evaluates it."
allowed_tools: ["Bash", "Read", "Write", "Glob", "Agent"]
---

# /session

Run one supervised sprint round (Variant A or B, supervised mode).

Run the **Command Pre-Flight Validation** from SKILL.md before proceeding.

Read `plugins/harness/skills/harness/references/orchestration.md` section **Session Procedure** and follow it. That reference contains all procedural steps: Session Startup, Contract Phase (with interactive review loop), Implementation Phase, Evaluation Phase, Post-flight, Auto-Commit, Artifact Validation, Session End, Handoff Cleanup, and Sprint Resume table.
