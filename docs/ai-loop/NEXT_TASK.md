```markdown
# Worker Prompt Template

## Context

The `nail-report` application is currently in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task initiates the test coverage efforts by adding unit tests for core Firebase helper functions.

## Objective

Add initial unit tests for helper functions within `src/lib/firestore.ts` using Vitest, focusing on mocking Firebase SDK interactions.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if necessary for testing, but primarily adding tests for existing functions)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (minor configuration if absolutely necessary to enable mocking, but prefer existing setup)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval; Vitest is assumed to be already set up as per roadmap)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` or any UI-related files

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm test` before finishing.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Implement unit tests for at least two distinct helper functions within `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Ensure Firebase SDK functions (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`) are properly mocked using `vitest` and `vi.mock`.
- Tests should verify the correct arguments are passed to the mocked Firebase functions and that the functions return expected values.

## Worker prompt

Implement initial unit tests for the Firebase Firestore helper functions.

1.  **Create a new test file:** In `src/__tests__/`, create `firestore.test.ts`.
2.  **Mock Firebase SDK:** Use `vi.mock` to mock `firebase/firestore` and `firebase/app` to prevent actual Firebase calls during tests. Focus on mocking the functions relevant to the `firestore.ts` helpers you choose to test.
3.  **Implement tests:**
    *   Choose at least two functions from `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`).
    *   For each chosen function, write unit tests that assert:
        *   The function calls the correct mocked Firebase Firestore methods (e.g., `addDoc`, `getDocs`).
        *   The function passes the expected arguments to these mocked methods.
        *   The function correctly handles successful responses from the mocked Firebase methods.
        *   (Optional but encouraged for one function) The function gracefully handles errors from the mocked Firebase methods.
4.  **Ensure exports are testable:** If any function in `src/lib/firestore.ts` is not exported, ensure it is exported so it can be imported and tested.
5.  **Run checks:** Before submitting, run `npm test`, `npm run build`, and `npm run lint`.

## Acceptance Criteria

- A new file `src/__tests__/firestore.test.ts` is created.
- This file contains tests for at least two functions from `src/lib/firestore.ts`.
- The Firebase SDK interactions are mocked using Vitest's `vi.mock`.
- `npm test` runs successfully without errors.
- `npm run build` and `npm run lint` pass.

## Required test commands

```bash
npm test
npm run build
npm run lint
```
```
