# Worker Prompt Template

## Context

The product roadmap prioritizes improving stability and test coverage in Phase 2.1. The current task focuses on adding foundational unit tests for Firebase helper functions to increase code reliability and prevent regressions.

## Objective

Implement unit tests for the `addNailItem` and `getNailItem` functions within `src/lib/firestore.ts` using Vitest, ensuring proper mocking of the Firebase SDK.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing)
- `src/__tests__/lib/firestore.test.ts` (new test file)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Write unit tests for at least `addNailItem` and `getNailItem` functions.
- Mock the Firebase Firestore SDK (e.g., `getFirestore`, `collection`, `addDoc`, `doc`, `getDoc`) using `vi.mock` to isolate tests from actual Firebase calls.
- Ensure tests cover successful operations and basic error handling where applicable (e.g., a rejected promise from `addDoc`).
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
