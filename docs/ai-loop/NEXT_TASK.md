# Worker Prompt Template

## Context

The current phase (Phase 2) focuses on improving stability, test coverage, and UX. This task specifically addresses Phase 2.1: "Test coverage". The goal is to begin adding unit tests for core application logic, starting with the Firestore helper functions.

## Objective

Add Vitest unit tests for the helper functions in `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing, if necessary, but prefer not to alter core logic)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (to configure Vitest if needed, though it should already be set up)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Create a new test file for `src/lib/firestore.ts` (e.g., `src/__tests__/firestore.test.ts`).
- Mock Firebase Firestore SDK calls using `vitest`'s `vi.mock` functionality.
- Write unit tests for at least 2-3 key functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Focus on verifying that the helper functions correctly interact with the mocked Firebase SDK (e.g., call `addDoc` with correct arguments, `getDocs` when fetching, etc.).
- Do not modify the actual Firebase SDK setup or initialization.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
