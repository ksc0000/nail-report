# Worker Prompt Template

## Context

The application is in Phase 2, focusing on improving stability, test coverage, and UX. This task addresses the "2.1 Test coverage" goal by adding unit tests for core helper functions. Vitest is already configured.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability, if necessary)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only to add a `test` script if missing and points to Vitest, but no new dependencies)
- `vite.config.ts` (minor adjustments for Vitest setup, if necessary)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files outside `src/` except specified config files.

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Worker prompt

You are tasked with adding unit tests for the Firebase Firestore helper functions located in `src/lib/firestore.ts`.

1.  **Create a new test file**: Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK**: Use `vi.mock` to mock Firebase Firestore SDK dependencies (`firebase/firestore`, `firebase/auth`, etc.) as needed to isolate the logic in `firestore.ts` for testing. Focus on mocking the Firestore client itself rather than hitting actual Firebase services.
3.  **Write Unit Tests**: Add tests for key functions in `src/lib/firestore.ts`. Prioritize functions related to common CRUD operations or data retrieval that interact directly with Firestore.
    *   Example functions to test: `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`, `getPublicShare`.
4.  **Ensure Test Coverage**: Aim for good test coverage for the functions you choose to test.
5.  **Run Tests**: Verify all tests pass by running `npm run test`.
6.  **Lint and Build**: Ensure the project still builds and passes lint checks.

## Acceptance Criteria

-   A new file `src/__tests__/firestore.test.ts` exists.
-   Key functions in `src/lib/firestore.ts` (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`, `getPublicShare`) have corresponding unit tests.
-   Tests use `vi.mock` effectively to simulate Firebase SDK behavior without making actual network calls.
-   All tests pass when running `npm run test`.
-   The total diff is less than 150 lines.

## Required Test Commands

```bash
npm run test
npm run build
npm run lint
```
