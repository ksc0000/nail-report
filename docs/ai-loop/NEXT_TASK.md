# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. The current state indicates that the first substantive task is pending. Improving test coverage for core helper functions is a high-priority item in Phase 2.1.

## Objective

Implement unit tests for the `src/lib/firestore.ts` helper functions using Vitest, focusing on a few key CRUD operations.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally only add tests)
- `src/__tests__/` (new test file, e.g., `src/__tests__/lib/firestore.test.ts`)
- `vite.config.ts` (minor additions for Vitest setup, if necessary, but assume Vitest is generally configured)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/lib/firestore.test.ts`.
- Write unit tests for at least two of the following functions in `src/lib/firestore.ts`: `addNailItem`, `getNailItem`, `updateNailItem`, `deleteNailItem`.
- Use Vitest for testing.
- Mock Firebase SDK dependencies (Firestore `doc`, `collection`, `setDoc`, `getDoc`, `updateDoc`, `deleteDoc` etc.) to ensure tests are isolated unit tests. Do not interact with actual Firebase services.
- Ensure the tests cover successful operations and basic error handling scenarios (e.g., if a mock Firestore call rejects).
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
