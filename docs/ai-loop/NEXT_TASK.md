# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task.

## Objective

Implement unit tests for key helper functions in `src/lib/firestore.ts` using Vitest, focusing on mocking Firebase SDK interactions.

## Allowed Scope

- `src/lib/firestore.ts`
- `src/__tests__/firestore.test.ts` (new file)
- `vite.config.ts` (only if absolutely necessary for Vitest configuration, assume basic setup exists)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files outside the `src/` directory, except as explicitly allowed.

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Worker prompt

Your task is to add unit tests for selected helper functions within the `src/lib/firestore.ts` file, leveraging Vitest and Firebase SDK mocking. This directly addresses roadmap item "2.1 Test coverage" and "Mocking Firebase SDK".

1.  **Create a new test file:** `src/__tests__/firestore.test.ts`.
2.  **Identify key functions:** Choose 2-3 core functions from `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, or similar data manipulation functions).
3.  **Implement unit tests:** For each chosen function, write comprehensive unit tests using Vitest's assertion library.
4.  **Mock Firebase SDK:** Crucially, mock the Firebase Firestore SDK (e.g., `firebase/firestore`) using `vi.mock` to ensure tests are fast, isolated, and do not make actual network calls to Firebase. Focus on testing the application logic within the `firestore.ts` helper functions, not the Firebase SDK itself.
    *   You will likely need to mock `getFirestore`, `collection`, `addDoc`, `getDocs`, `doc`, `updateDoc`, `deleteDoc`, and their return values.
5.  **Verify test results:** Ensure all new tests pass.

**Acceptance Criteria:**
- A new file `src/__tests__/firestore.test.ts` is created.
- At least 2-3 significant functions from `src/lib/firestore.ts` are covered by unit tests.
- Firebase Firestore SDK interactions are effectively mocked, preventing actual database calls during tests.
- All new tests pass when running `npm run test`.

**Required Test Commands:**
- `npm run lint`
- `npm run build`
- `npm run test`
