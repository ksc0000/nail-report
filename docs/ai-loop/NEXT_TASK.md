# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage effort by adding unit tests for core Firestore helper functions. Vitest is already configured as the test runner.

## Objective

Implement unit tests for the core CRUD helper functions within `src/lib/firestore.ts` using Vitest. Specifically, focus on `addItem`, `updateItem`, `deleteItem`, and `getItem`.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability if necessary)
- `src/__tests__/firestore.test.ts` (new file)
- `vitest.config.ts` (minor modifications if absolutely necessary for mocking, but assume Vitest is set up)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file `src/__tests__/firestore.test.ts`.
- Write unit tests for `addItem`, `updateItem`, `deleteItem`, and `getItem` functions from `src/lib/firestore.ts`.
- Use `vi.mock` to mock Firebase SDK dependencies (e.g., `getFirestore`, `collection`, `doc`, `getDoc`, `setDoc`, `updateDoc`, `deleteDoc`).
- Ensure tests cover successful operations and basic error handling cases (e.g., when a Firebase operation fails).
- Keep the diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
