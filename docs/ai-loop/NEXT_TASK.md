```markdown
# Worker Prompt Template

## Context

The project is in Phase 2, focusing on improving stability, test coverage, and UX. A key area is adding unit tests for Firebase helper functions. This task specifically targets `src/lib/firestore.ts` to improve test coverage for data operations.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`. The tests should mock Firebase SDK dependencies appropriately.

## Allowed Scope

- `src/lib/firestore.ts` (minor refactoring to improve testability, if necessary, but primarily ensuring it's testable)
- `src/__tests__/` (create `src/__tests__/firestore.test.ts` for the new unit tests)
- `vite.config.ts` (if Vitest setup requires minor adjustments for mocking)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Focus on testing key functions in `src/lib/firestore.ts` such as `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`, etc.
- Use `vi.mock` to mock Firebase SDK dependencies (e.g., `firebase/firestore`).
- Ensure tests cover successful operations and basic error handling scenarios.
- Run `npm run test` to ensure tests pass.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---

## Worker Prompt

Implement unit tests for `src/lib/firestore.ts` using Vitest.

1.  **Create a new test file:** Add `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:** Use `vi.mock` to mock `firebase/firestore` functions, ensuring that actual Firebase calls are not made during tests. Focus on mocking the `getFirestore`, `collection`, `query`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc` methods and related constructs (e.g., `QuerySnapshot`, `DocumentSnapshot`).
3.  **Write Tests:** Implement unit tests for core CRUD operations and any other helper functions in `src/lib/firestore.ts`.
    *   Test `getNailItems` to ensure it correctly fetches and processes data.
    *   Test `addNailItem` to verify it calls `addDoc` with correct arguments.
    *   Test `updateNailItem` to verify it calls `updateDoc` with correct arguments.
    *   Test `deleteNailItem` to verify it calls `deleteDoc` with correct arguments.
4.  **Error Handling (Basic):** Include a basic test case for one function (e.g., `getNailItems`) that simulates a Firebase error and verifies the function handles it gracefully (e.g., rejects the promise, logs an error, etc., depending on existing implementation).
5.  **Run Checks:** Execute `npm test`, `npm run build`, and `npm run lint` to confirm everything is working correctly and adheres to code standards.

Remember to keep the PR focused and small (aim for <= 150 lines diff).
```
