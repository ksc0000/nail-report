# Worker Prompt Template

## Context

The current phase (Phase 2) focuses on improving stability, test coverage, and UX. This task directly addresses "2.1 Test coverage" by adding unit tests for core Firebase Firestore helper functions, crucial for application stability and maintainability.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. Focus on covering essential CRUD operations for `nailItems` or `publicShares` that are handled by functions in this file.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prioritize creating a new test file)
- `src/__tests__/firestore.test.ts` (new test file)
- `vitest.config.ts` (minor additions for setup, if strictly necessary for mocks, but prefer using `vi.mock` directly in test files)

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
- Use Vitest and its mocking capabilities (`vi.mock`) to isolate `src/lib/firestore.ts` functions from actual Firebase interactions.
- Focus on testing at least 2-3 key helper functions from `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItem`, `deleteNailItem` or similar functions that interact with Firestore).
- Ensure tests cover successful operations and basic error handling if applicable to the function's logic.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---

### Worker Prompt

Your task is to add unit tests for the Firebase Firestore helper functions located in `src/lib/firestore.ts`.

1.  **Create a new test file:** `src/__tests__/firestore.test.ts`.
2.  **Set up Vitest mocks:** Use `vi.mock` to mock the Firebase Firestore SDK (e.g., `firebase/firestore`) so that tests do not make actual calls to Firebase. This typically involves mocking functions like `collection`, `doc`, `getDoc`, `setDoc`, `updateDoc`, `deleteDoc`, etc.
3.  **Identify functions to test:** In `src/lib/firestore.ts`, identify the core functions that abstract Firestore operations, such as `addNailItem`, `getNailItem`, `updateNailItem`, `deleteNailItem`, and potentially those for `publicShares`.
4.  **Write unit tests:** For at least 2-3 of these functions, write tests to verify their behavior under typical success conditions. For example:
    *   Test `addNailItem` correctly calls `addDoc` with the provided data.
    *   Test `getNailItem` correctly calls `getDoc` and transforms the snapshot data.
    *   Test `deleteNailItem` correctly calls `deleteDoc`.
5.  **Keep it small:** Aim to test a minimum set of functions to stay within the 150-line diff limit. Report any further functions as "Suggested next task".
6.  **Run checks:** Before committing, ensure the project builds and lints correctly by running `npm run build && npm run lint`.
