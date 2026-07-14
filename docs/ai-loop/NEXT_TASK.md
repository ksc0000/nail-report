# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage efforts by targeting core Firebase helper functions.

## Objective

Add Vitest unit tests for a single, simple helper function within `src/lib/firestore.ts`.

## Allowed Scope

-   `src/lib/firestore.ts` (for inspection, minimal modification if necessary for testability)
-   `src/__tests__/firestore.test.ts` (new file)
-   `src/__tests__/` (other new test files, if strictly necessary and small)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files outside of `src/` (except documentation)

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Prefer adding tests when touching `src/lib/` files.
-   Report follow-up items as comments, not additional code.

## Worker prompt

Locate `src/lib/firestore.ts`. Identify a simple, self-contained helper function within this file, such as one responsible for adding a single nail item (e.g., `createNailItem`) or retrieving a single item (e.g., `getNailItem`). If functions are not explicitly named this way, choose a function that performs a single, atomic Firestore operation (e.g., `addDoc`, `getDoc`, `setDoc` wrapper).

Create a new test file at `src/__tests__/firestore.test.ts`. Write a unit test for the chosen function. The test should mock the Firebase Firestore SDK (specifically `firebase/firestore`) using `vi.mock` to simulate successful operations. Verify the function's expected output or side effects based on the mocked Firestore behavior.

This task should focus on testing *one* selected helper function to ensure the test setup for Firebase mocking is correct and functional. Do not attempt to test all functions in `src/lib/firestore.ts` in this single PR.

## Acceptance Criteria

-   A new file `src/__tests__/firestore.test.ts` is created.
-   This file contains unit tests for at least one simple helper function from `src/lib/firestore.ts`.
-   The tests successfully mock the Firebase Firestore SDK using `vi.mock`.
-   The tests pass when running `npm test`.

## Required Test Commands

```bash
npm install # Ensure all dependencies are up-to-date
npm run build
npm run lint
npm test
```

---
**Summary of what changed:**
-   Added a new test file `src/__tests__/firestore.test.ts`.
-   Implemented a unit test for a simple helper function in `src/lib/firestore.ts`, mocking Firebase Firestore.

**Changed files list:**
-   `src/__tests__/firestore.test.ts` (new)
-   `src/lib/firestore.ts` (minor modification for export or testability, if strictly needed)

**Commands run and results:**
-   `npm install`
-   `npm run build`
-   `npm run lint`
-   `npm test` (all tests passed)

**Known issues or limitations:**
-   Only one function from `src/lib/firestore.ts` has unit tests. Comprehensive test coverage for the file is a follow-up task.
-   Error handling scenarios might not be fully covered in this initial test.

**Suggested next task:**
Add Vitest unit tests for another simple helper function in `src/lib/firestore.ts`, focusing on an error handling scenario.
