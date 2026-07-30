# Worker Prompt Template

## Context

The product roadmap for `nail-report` includes a significant focus on improving stability and test coverage in Phase 2. This task specifically targets adding unit tests for the core `firestore.ts` helper functions, which are critical for interacting with the Firebase Firestore database.

## Objective

Implement unit tests for the essential helper functions within `src/lib/firestore.ts` using Vitest, ensuring that Firebase SDK calls are appropriately mocked to enable isolated testing of the application's logic.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability if strictly necessary)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (if Vitest configuration updates are needed, but Vitest should already be set up)

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
- Run `npm test` and ensure all newly added tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

Your task is to add comprehensive unit tests for the `src/lib/firestore.ts` file.

1.  **Create a new test file:** Add `src/__tests__/firestore.test.ts`.
2.  **Implement tests for key functions:** Write unit tests for the following functions from `src/lib/firestore.ts`:
    *   `addNailItem`
    *   `updateNailItem`
    *   `deleteNailItem`
    *   `getNailItems`
    *   `getNailItem`
    *   `getPublicShare`
3.  **Mock Firebase SDK:** Use `vi.mock` from Vitest to mock the `firebase/firestore` module. Specifically, mock functions such as `collection`, `addDoc`, `updateDoc`, `deleteDoc`, `getDocs`, `getDoc`, `query`, `where`, `doc`, `orderBy`, `limit`, and any other Firestore-related functions called within `firestore.ts` helpers. The goal is to test the application's logic, not the Firebase SDK itself.
4.  **Assertions:** Ensure tests include appropriate assertions to verify the correct behavior of the `firestore.ts` functions, including arguments passed to mocked Firebase functions and returned values.
5.  **Run tests:** Execute `npm test` to confirm all new tests pass.

**Acceptance Criteria:**
- A new file `src/__tests__/firestore.test.ts` exists and contains unit tests.
- All specified functions in `src/lib/firestore.ts` have at least one test case.
- Firebase Firestore SDK calls are effectively mocked using `vi.mock`.
- Running `npm test` shows successful completion of the new tests.

**Required Test Commands:**
```bash
npm run build
npm run lint
npm test
```
