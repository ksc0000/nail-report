# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task.

## Objective

Implement unit tests for one or two helper functions within `src/lib/firestore.ts` using Vitest. This task primarily involves setting up the testing environment for Firebase SDK mocking and demonstrating a basic test case.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes to export functions if needed for testing, but prioritize adding tests)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (if Vitest configuration is not already present or needs minor adjustments for Firebase mocking)
- `package.json` (only to add `vitest` as a `devDependency` if not already present, and to add a test script if missing. *Crucially, ensure no new *npm packages* are added beyond vitest itself if it's not already installed. If vitest is already installed, do not add anything here.*)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no *new* npm packages beyond `vitest` itself if not present, no new non-dev dependencies)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Install `vitest` as a dev dependency and configure it if it's not already set up. If `vitest` is already a dev dependency, proceed directly to writing tests.
- Create `src/__tests__/firestore.test.ts`.
- Mock the Firebase SDK (e.g., `firebase/firestore`) appropriately to allow for isolated unit testing of `src/lib/firestore.ts` functions.
- Write at least two basic unit tests for one or two simple functions in `src/lib/firestore.ts` (e.g., a function to add or get a document). These tests should not make actual network calls to Firebase.
- Run `npm run build && npm run lint && npm run test` (assuming `npm run test` executes vitest) before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
