```markdown
# Worker Prompt Template

## Context

The product roadmap indicates that Phase 2.1 focuses on improving test coverage. The current state shows that no specific unit test tasks for `src/lib/firestore.ts` have been completed yet. Vitest is the designated test runner.

## Objective

Implement unit tests for helper functions within `src/lib/firestore.ts` using Vitest, specifically focusing on mocking Firebase SDK interactions.

## Allowed Scope

- `src/lib/firestore.ts` (read only to understand functions for testing)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/__tests__/` (any new necessary mock files for Firebase)
- `package.json` (to verify test scripts, no modifications allowed)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Add unit tests for at least two simple helper functions in `src/lib/firestore.ts` (e.g., `addNailItem` and `getNailItems`).
- Effectively mock Firebase Firestore SDK interactions using `vi.mock` to ensure tests are isolated and do not hit actual Firebase services.
- Ensure the tests can be run successfully using `npm test`.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
**Worker Prompt**

Your task is to create a new test file `src/__tests__/firestore.test.ts` and add unit tests for functions in `src/lib/firestore.ts`.

1.  **Create Test File**: Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase Firestore**: Use `vi.mock` to mock the Firebase Firestore SDK. You will need to mock functions like `getFirestore`, `collection`, `addDoc`, `getDocs`, etc., as needed by the functions you are testing.
3.  **Test `addNailItem`**: Write a test for the `addNailItem` function that verifies it calls the underlying Firestore `addDoc` with the correct collection and data.
4.  **Test `getNailItems`**: Write a test for the `getNailItems` function that verifies it fetches documents correctly and maps them to the expected structure.
5.  **Run Tests**: Execute `npm test` and ensure all new tests pass.
6.  **Lint and Build**: Run `npm run lint` and `npm run build` to confirm no new errors are introduced.

Focus on creating robust mocks that allow the `firestore.ts` functions to be tested in isolation.
```
