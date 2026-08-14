# Worker Prompt Template

## Context

The current phase is 2.0, focusing on improving stability, test coverage, and UX. This task is the first substantive step towards enhancing test coverage, specifically for core Firebase helper functions.

## Objective

Add unit tests for the `addNailItem` and `getNailItems` functions located in `src/lib/firestore.ts` using Vitest. This involves setting up the necessary Firebase SDK mocks for Firestore.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but primarily testing)
- `src/__tests__/` (new test file, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (if minor configuration is needed for mocks, but prefer minimal changes)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` (not relevant for this task)

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- The new tests must properly mock the Firebase Firestore SDK to ensure isolation.
- Focus specifically on `addNailItem` and `getNailItems` functions.
- Ensure tests cover basic success cases for both functions.
- Report follow-up items as comments, not additional code.

## Worker prompt

Implement unit tests for `src/lib/firestore.ts`.

1.  **Create a new test file:** Create `src/__tests__/firestore.test.ts`.
2.  **Set up Vitest environment:** Assume Vitest is already configured. If not, report as a blocking issue.
3.  **Mock Firebase Firestore SDK:** Implement mocks for `firebase/firestore` functions (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `query`, `where`, `orderBy`, `Timestamp`) as needed to test `addNailItem` and `getNailItems` in isolation.
4.  **Write tests for `addNailItem`:**
    *   Verify that `addNailItem` successfully calls `addDoc` with the correct collection and data.
    *   Ensure the `createdAt` and `updatedAt` timestamps are correctly set.
5.  **Write tests for `getNailItems`:**
    *   Verify that `getNailItems` correctly fetches and processes a list of items from Firestore.
    *   Ensure proper use of `collection`, `query`, and `getDocs`.
    *   Test handling of empty results.

**Acceptance Criteria:**
- A new file `src/__tests__/firestore.test.ts` exists.
- This file contains `describe` blocks and `it` tests for `addNailItem` and `getNailItems`.
- The tests run successfully with `npm run test`.
- Firebase Firestore SDK is mocked, allowing tests to run without actual Firebase calls.

**Required test commands:**
```bash
npm install # (if package.json changes, which it shouldn't for this task)
npm run test
npm run build
npm run lint
```
