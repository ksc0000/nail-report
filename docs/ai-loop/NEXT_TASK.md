# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, focusing on stability, test coverage, and UX. This task initiates the test coverage effort by adding unit tests for core Firebase Firestore helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. Focus on covering basic CRUD operations for nail items and public shares.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments if needed for testability)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (minor additions if needed for mocking setup, unlikely for this task)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file named `src/__tests__/firestore.test.ts`.
- Implement unit tests for a selection of helper functions in `src/lib/firestore.ts`, such as `addNailItem`, `updateNailItem`, `deleteNailItem`, `getNailItems`, and `getPublicShare`.
- Use Vitest and mock Firebase SDK methods (e.g., `db`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`) to isolate the logic in `firestore.ts`.
- Ensure tests cover successful operations and basic error scenarios if applicable.
- Keep the diff for this PR ≤ 150 lines. Focus on initial coverage rather than 100% coverage of all functions.
- Run `npm run build && npm run lint` before finishing to ensure code quality and prevent build issues.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
