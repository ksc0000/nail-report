# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage effort by adding unit tests for core Firebase utility functions.

## Objective

Implement initial unit tests for the helper functions in `src/lib/firestore.ts` using Vitest, focusing on mocking Firebase SDK calls.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing)
- `src/__tests__/firestore.test.ts` (new test file)
- `src/` (minor adjustments if necessary to facilitate testing, except `src/main.tsx`)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file: `src/__tests__/firestore.test.ts`.
- Set up `vitest` and `vi.mock` to mock Firebase SDK functions (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`) used within `src/lib/firestore.ts`.
- Implement at least one basic unit test for one of the helper functions in `src/lib/firestore.ts` (e.g., `createNailItem`, `getNailItems`, `updateNailItem`, or `deleteNailItem`). The goal is to establish the testing pattern and infrastructure.
- The diff for the entire PR must be ≤ 150 lines.
- Run `npm run build && npm run lint && npm test` before finishing and ensure all commands pass.
- Report follow-up items (e.g., remaining functions in `firestore.ts` that need testing, or testing for other `src/lib` files) as comments in the PR, not as additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
