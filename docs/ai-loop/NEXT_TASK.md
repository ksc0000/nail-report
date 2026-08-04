# Worker Prompt Template

## Context

The `nail-report` application is currently in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. The current objective is to enhance test coverage for core utility functions. This task specifically addresses the "Unit tests for Firestore helper functions (`src/lib/firestore.ts`)" item under Phase 2.1.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. The tests should mock the Firebase Firestore SDK to ensure isolated unit testing.

## Allowed Scope

- `src/lib/firestore.ts` (modifications only if necessary for testability, e.g., exporting unexported functions, but prefer not to)
- `src/__tests__/firestore.test.ts` (new file)
- `vite.config.ts` (minor additions for Vitest configuration, if absolutely necessary, but Vitest should already be set up)
- `package.json` (only to add `test` script if not present, but `vitest` should be installed)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval, Vitest should already be present)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css`
- Any files outside the `src/` directory except `vite.config.ts` if strictly necessary for Vitest setup.

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files (this task *is* adding tests).
- Report follow-up items as comments, not additional code.

## Worker Prompt

1.  **Create a new test file:** Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase Firestore SDK:** Within `src/__tests__/firestore.test.ts`, use `vi.mock` to mock the necessary functions from `firebase/firestore`. This will allow you to test `src/lib/firestore.ts` functions in isolation without actual Firebase calls. You will likely need to mock `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`, `query`, `where`, etc.
3.  **Write Unit Tests:** Implement unit tests for the core helper functions in `src/lib/firestore.ts`. Focus on the following functions:
    *   `addNailItem`
    *   `getNailItems`
    *   `updateNailItem`
    *   `deleteNailItem`
    *   `getPublicShare`
    *   `addPublicShare` (if applicable)
    *   Ensure tests cover successful execution paths and verify that the mocked Firestore functions are called with the correct arguments.
4.  **Test Coverage:** Aim for at least basic test coverage for the major CRUD operations and public share functionalities.

## Acceptance Criteria

- A new file `src/__tests__/firestore.test.ts` exists.
- This file contains `vi.mock` calls for `firebase/firestore`.
- At least three functions from `src/lib/firestore.ts` (`addNailItem`, `getNailItems`, `updateNailItem` or `deleteNailItem`, `getPublicShare`) have associated unit tests.
- All new tests pass successfully when `npm test` is run.
- The `npm run build` and `npm run lint` commands complete without errors.

## Required Test Commands

```bash
npm test
npm run build
npm run lint
```
