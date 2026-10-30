# Independent review request — Stage 10B gate (before the 63-photo collection)

You are an independent reviewer. Review the repository **ksc0000/nail-report**, branch
**`claude/festive-lovelace-5teapy`**, as a **research / architecture / implementation gate**
before the owner takes the 63 real photos of Stage 10B. This is not a code-style review.

**Read the repository yourself.** The pointers below say where things are; they are not
conclusions, and nothing in this file should be taken as evidence. Where the documentation and the
code disagree, the code is what will run.

## Where things are

| | |
|---|---|
| Stage log and plan | `docs/product/NAIL_SOCKET_POC_PLAN.md` — mainly §6-J (Stage 8), §6-K (Stage 9), §6-L (Stage 10, incl. "Stage 10A") |
| Layer A contract | `docs/product/SCAN_OBSERVATION_CONTRACT.md` (§1–§5, §4.4, §4.5) |
| Stage 9 frames (F0, F3dNoTip, …) | `src/lib/nail3dCanonicalFrames.ts`, `tests/nail3dCanonicalFrames.test.ts`, `tests/support/frameHarness.ts` |
| Stage 10 analysis, frozen before any photo | `research/stage10/kit.ts`, `research/stage10/criteria.ts`, `research/stage10/analyze.ts` |
| Stage 10A capture-pipeline smoke check | `research/stage10/smoke.ts`, `research/stage10/smoke-check.ts`, `research/stage10/vision-dump.swift` |
| Operator procedure | `research/stage10/README.md` |
| Synthetic stand-in in the real format, and its tests | `tests/support/stage10DryRun.ts`, `tests/nail3dStage10Kit.test.ts`, `tests/nail3dStage10Smoke.test.ts` |
| Upstream code the analysis calls unchanged | `src/lib/nail3dProfilePose.ts`, `nail3dHandCalibration.ts`, `nail3dMultiView.ts`, `nail3dSocket.ts`, `nail3dStability.ts`, `nail3dObservation.ts` |
| Stage 10A data, if already collected | `research/stage10/data/smoke-*/` (JSON, CSV and reports only — photos are never committed) |

Concentrate on Stages 8–10. Go back to earlier stages (§6-E … §6-I) or other code only when a
finding needs it. You may run, for example, `npm run test` or
`node --experimental-strip-types research/stage10/analyze.ts --dry-run` to check a claim. The dry
run writes only to stdout; in a read-only sandbox, a test that writes a temporary directory can fail
for that reason alone, so tell a sandbox denial apart from a failing assertion before reporting it.

## What to attack

Verify each of these aggressively:

1. Is Stage 10 designed so that **F0 and F3dNoTip are compared fairly**?
2. Does the sampling design — **12 sessions, N0/N1 alternating, 2 views × 2 shots** — contain
   confounding, pseudo-replication, or a mistaken assumption of independence?
3. Do the criteria **B1–B7** contain double dipping, circular reasoning, overfitting to the synthetic
   model, or statistically inappropriate decisions?
4. Is the **manual annotation misused as 3D ground truth** anywhere?
5. Does the **selection of F3dNoTip in Stage 9** introduce a selection bias into the Stage 10 decision?
6. What **implicit assumptions** survive the move from synthetic to real data?
7. Does the **Stage 10A measurement pipeline** still contain coordinate-system, orientation, Vision or
   annotation problems that would corrupt real data?
8. Which **negative controls / sanity checks** are missing and needed before Stage 10B starts?
9. What problems remain that, **if found after the experiment started, would force re-shooting all
   63 photos**?

## Rules

- **Read-only.** Do not modify, create or commit files in the repository.
- Cite **file paths and line numbers** for every finding.
- The goal is **not** a long list of small improvements, and not a more perfect study. It is: *can the
  current Stage 10B produce real-photo evidence that is trustworthy enough for the next decision?*
- Classify every finding as exactly one of:
  - **BLOCKING** — Stage 10B must not start until this is fixed;
  - **NON-BLOCKING** — advisable to fix before shooting, but 10B would still be informative without it;
  - **NOT NOW** — no action needed for 10B.
- For each finding give: what is wrong · the evidence (file:line) · why it matters for the 10B decision
  · the smallest change that would resolve it.

## Output

Markdown, in this order:

1. **Verdict summary** (3–5 lines)
2. **BLOCKING** findings
3. **NON-BLOCKING** findings
4. **NOT NOW** findings (one line each)
5. **Answers to questions 1–9** (a few lines each, pointing to the findings above)
6. A final line containing exactly one of: **`GO`**, **`GO WITH CHANGES`**, **`NO-GO`** — for Stage 10B —
   followed by the reasons.
