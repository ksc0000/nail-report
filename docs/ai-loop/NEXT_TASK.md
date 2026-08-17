# Worker Prompt Template

## Context

The current roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses the "2.1 Test coverage" goal by adding unit tests for Firebase helper functions. Vitest has been selected as the test runner, and the goal is to start implementing tests for core application logic.

## Objective

Implement unit tests for at least two key helper functions within `src/lib/firestore.ts` using Vitest, ensuring proper mocking of Firebase SDK dependencies.

## Allowed Scope

- `src/lib/firestore.ts` (minimal changes for testability, if necessary)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (only if Vitest setup specifically requires modification, which is unlikely for adding tests)

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

## Worker prompt

Implement unit tests for at least two core helper functions located in `src/lib/firestore.ts`.

1.  **Create a new test file**: Create `src/__tests__/firestore.test.ts`.
2.  **Identify functions**: Choose at least two key functions from `src/lib/firestore.ts` that interact with Firestore (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, `getNailItemById`).
3.  **Mock Firebase SDK**: Use `vi.mock` to mock Firebase SDK methods (e.g., `getFirestore`, `collection`, `addDoc`, `getDocs`, `doc`, `updateDoc`, `deleteDoc`) as necessary to isolate the logic being tested.
4.  **Write unit tests**: Implement unit tests for the chosen functions to verify their expected behavior, including successful operations and potential error scenarios if easily testable with mocks.
5.  **Ensure tests pass**: Verify that all new tests pass by running the test command.

**Acceptance Criteria:**
- A new file `src/__tests__/firestore.test.ts` is created.
- This file contains well-structured unit tests for at least two functions from `src/lib/firestore.ts`.
- Firebase SDK dependencies are properly mocked using `vi.mock`.
- All new tests pass when `npm test` is run.

**Required Test Commands:**
```bash
npm test
npm run build
npm run lint
```
