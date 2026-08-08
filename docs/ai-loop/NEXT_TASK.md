```markdown
# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses "2.1 Test coverage". The current state indicates that `vitest` is the chosen test runner. This task focuses on adding initial unit tests for core Firebase utility functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, ensuring proper mocking of Firebase SDK methods.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability, if strictly necessary, but prefer not to change production code)
- `src/lib/__tests__/firestore.test.ts` (new file)
- `src/App.css` (No changes expected for this task)
- `vite.config.ts` (minor additions for test configuration, if strictly necessary for Vitest setup, but avoid adding new dependencies)

## Forbidden Scope

- `src/main.tsx`
- `commands/`
- `firestore.rules`, `storage.rules`
- `package.json` (no new npm packages, assumes `vitest` is already a dev dependency)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` and ensure all new tests pass.
- Write unit tests for at least two exported functions in `src/lib/firestore.ts`. Focus on functions that interact with Firestore directly (e.g., `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`).
- Properly mock Firebase SDK functions (`getFirestore`, `collection`, `doc`, etc.) using `vi.mock` to isolate the unit under test.
- Do not make actual calls to Firebase during tests.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

Hello Jules,

Your next task is to add unit tests for the helper functions in `src/lib/firestore.ts`.

1.  **Create a new test file**: Create `src/lib/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK**: Set up mocks for Firebase Firestore functions (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`) using `vi.mock` to prevent actual Firebase calls during tests. Ensure the mocks return predictable data.
3.  **Write Tests**: Implement unit tests for at least two key functions exported from `src/lib/firestore.ts`. Good candidates include `createNailItem`, `getNailItems`, `updateNailItem`, or `deleteNailItem`, or lower-level helpers if present. Focus on testing the logic that interacts with the mocked Firestore API.
4.  **Run Tests**: Execute `npm test` and ensure your new tests pass successfully.
5.  **Lint and Build**: Run `npm run lint` and `npm run build` to ensure code quality and build integrity.

If Vitest is not yet configured or installed, please report this as a blocker, but assume `vitest` is already listed in `devDependencies` and `npm test` is configured to run Vitest.

Good luck!
```
