# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on stability, test coverage, and UX. This task addresses Phase 2.1, specifically improving test coverage for core Firebase helper functions.

## Objective

Add Vitest unit tests for selected helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prioritize creating a test file)
- `src/__tests__/firestore.test.ts` (new file for unit tests)

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

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to implement unit tests for the Firebase Firestore helper functions located in `src/lib/firestore.ts`.

1.  **Create a new test file:** Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:** Use `vi.mock` to mock the Firebase Firestore SDK calls (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `getDoc`, `addDoc`, `updateDoc`, `deleteDoc`). Focus on isolating the logic within `firestore.ts` itself.
3.  **Implement tests for `addNailItem`:**
    *   Verify that `addNailItem` correctly calls the mocked `addDoc` with the expected collection path and data.
    *   Test both success and potential error paths if `addNailItem` handles them.
4.  **Implement tests for `updateNailItem`:**
    *   Verify that `updateNailItem` correctly calls the mocked `updateDoc` with the expected document reference and updated data.
    *   Test both success and potential error paths.
5.  **Implement tests for `deleteNailItem`:**
    *   Verify that `deleteNailItem` correctly calls the mocked `deleteDoc` with the expected document reference.
    *   Test both success and potential error paths.
6.  Ensure tests are clear, concise, and pass.

**Acceptance Criteria:**

-   A new file `src/__tests__/firestore.test.ts` exists.
-   This file contains passing unit tests for `addNailItem`, `updateNailItem`, and `deleteNailItem` from `src/lib/firestore.ts`.
-   Firebase Firestore SDK interactions are mocked to test the `firestore.ts` logic in isolation.

**Required test commands:**

```bash
npm test
npm run build
npm run lint
```
