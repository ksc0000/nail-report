# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. The first priority within this phase is to increase test coverage, specifically starting with helper functions.

## Objective

Implement unit tests for Firestore helper functions located in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (for minor adjustments if needed for testability, but primarily adding tests)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/test-setup.ts` (if required for global test setup/mocking, new file)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Worker prompt

1.  Create a new test file: `src/__tests__/firestore.test.ts`.
2.  Write unit tests for the functions exported from `src/lib/firestore.ts`.
3.  Focus on mocking Firebase SDK calls (Firestore, Auth, Storage) using `vitest`'s `vi.mock` functionality.
    *   Examples of functions to test include (but are not limited to): `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`.
4.  Ensure tests cover successful operations and basic error handling scenarios.
5.  Do NOT add any new npm dependencies to `package.json`. Assume `vitest` is already installed as a `devDependency`.
6.  The goal is to provide initial test coverage for this critical module within the specified line limit. Focus on clear, concise tests for the most important functionalities.

## Acceptance Criteria

- A new file `src/__tests__/firestore.test.ts` exists.
- This file contains at least 3-5 distinct test cases using `vitest` syntax.
- Firebase SDK dependencies are mocked appropriately using `vi.mock`.
- The tests run without errors.
- `npm run build` completes successfully.
- `npm run lint` reports no new issues.

## Required Test Commands

```bash
npm test
npm run build
npm run lint
```
