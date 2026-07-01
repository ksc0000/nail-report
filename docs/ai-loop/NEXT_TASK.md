# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage effort by adding unit tests for core Firebase helper functions.

## Objective

Add unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. This task specifically targets the `firestore.ts` module to improve code stability and prevent regressions.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prioritize testing existing exports)
- `src/__tests__/lib/firestore.test.ts` (new file)
- `src/lib/` (any other file in `src/lib/` for mocking purposes, if strictly necessary)
- `src/` (only for creating the test directory and file)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any UI components or styles (`src/App.css`, etc.)

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Create a new test file named `src/__tests__/lib/firestore.test.ts`.
- Write unit tests for at least two key functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Use Vitest's mocking capabilities to mock Firebase SDK dependencies (Firestore instances, doc references, etc.) to ensure tests are isolated and do not interact with a live Firebase project.
- Ensure tests cover basic success cases for the chosen functions.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
