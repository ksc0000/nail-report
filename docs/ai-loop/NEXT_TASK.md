# Worker Prompt Template

## Context

The current roadmap focuses on improving stability, test coverage, and UX in Phase 2. The immediate goal is to enhance test coverage, starting with core Firebase helper functions. Vitest is already configured for testing.

## Objective

Add comprehensive unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if necessary for testing)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/__tests__/setup.ts` (if needed for global mocks, though `vi.mock` in test file is preferred)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies (Firestore, `doc`, `collection`, `getDoc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`, etc.) using `vi.mock`.
- Write unit tests for at least the `addNailItem`, `updateNailItem`, `deleteNailItem`, `getNailItems`, `getNailItem`, `addPublicShare`, `deletePublicShare`, and `getPublicShare` functions in `src/lib/firestore.ts`.
- Ensure tests verify correct interaction with the mocked Firestore instance and return expected values.
- Run `npm run build && npm run lint && npm test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
