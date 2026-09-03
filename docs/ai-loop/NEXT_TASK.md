# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task. Phase 2.1 of the roadmap focuses on "Test coverage" with "Test runner: Vitest". This task initiates the implementation of unit tests for core application logic, specifically for Firebase Firestore helper functions.

## Objective

Implement initial unit tests for helper functions within `src/lib/firestore.ts` using Vitest. This involves setting up Vitest if it's not already configured, and writing at least two isolated unit tests.

## Allowed Scope

- `src/lib/firestore.ts` (minor refactors for testability if necessary, e.g., exporting unexported functions, but keep changes minimal)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (to add or update Vitest configuration, e.g., `test:` property)
- `package.json` (to add `vitest` as a `devDependency` if it's not already present, and to add an `npm run test` script; *no other dependencies or changes allowed*)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` (except for explicitly adding `vitest` as a `devDependency` and adding an `npm run test` script)
- Firebase deploy commands
- Secrets and credentials
- Modifying `src/App.css` or other CSS files for this task.

## Requirements

- Keep diff ≤ 150 lines.
- **Install Vitest**: If `vitest` is not already a `devDependency` in `package.json`, add it.
- **Configure Vitest**: Ensure `vite.config.ts` is configured to run Vitest tests.
- **Add Test Script**: Add an `npm run test` script to `package.json` that executes `vitest run` if one does not already exist.
- **Mock Firebase SDK**: Use `vi.mock` to mock Firebase SDK methods (e.g., Firestore instance, collection, doc, addDoc, getDoc, updateDoc, deleteDoc) to ensure tests are isolated and don't interact with a live Firebase project.
- **Write Unit Tests**: Add at least two simple unit tests for core functions in `src/lib/firestore.ts`. Examples could include testing `addNailItem`, `updateNailItem`, or `deleteNailItem`. Focus on testing the logic of the helper functions themselves, not actual Firebase integration.
- Run `npm run build && npm run lint && npm run test` before finishing. All commands must pass without errors.
- Report follow-up items as comments in the PR, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
