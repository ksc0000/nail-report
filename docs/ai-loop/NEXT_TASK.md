# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage effort by adding unit tests for a critical Firebase helper module.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`. The primary goal is to set up the testing environment for this module, including mocking the Firebase SDK, and to write tests for at least one core Firestore CRUD operation helper (e.g., a function that adds or retrieves a nail item).

## Allowed Scope

- `src/lib/firestore.ts` (for potential minor adjustments to aid testing, if necessary)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only for adding `vitest` or `jsdom` if not already present, and `test` scripts, but *not* new npm dependencies outside of basic testing infrastructure)
- `vite.config.ts` (for Vitest configuration)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages *beyond basic testing infrastructure* without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- **Set up Vitest** for the project if it's not already configured (add `vitest` and `jsdom` as `devDependencies` if needed, and a `test` script in `package.json`).
- **Implement Firebase SDK mocking** within the test file to isolate `src/lib/firestore.ts` logic.
- **Write at least one unit test** for a helper function in `src/lib/firestore.ts` that interacts with Firestore (e.g., `addNailItem`, `getNailItem`, `updateNailItem`, or `deleteNailItem`).
- Ensure `npm run build && npm run lint && npm run test` pass before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
