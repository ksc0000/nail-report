# Worker Prompt Template

## Context

The product roadmap is in Phase 2, focusing on improving stability, test coverage, and UX. The current state indicates that the AI Loop setup is complete, and a first substantive task is pending. This task directly addresses the "2.1 Test coverage" goal by adding unit tests for critical Firestore helper functions.

## Objective

Implement unit tests for the core Firestore helper functions located in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/firestore.ts` (modifications to export functions if needed for testing, or minor refactoring to enable testability)
- `src/__tests__/` (new test files, specifically `src/__tests__/lib/firestore.test.ts`)
- `src/App.css` (CSS improvements - not applicable for this task, but allowed)

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

Your task is to add unit tests for the core CRUD operations within `src/lib/firestore.ts`.

1.  **Create a new test file**: Create `src/__tests__/lib/firestore.test.ts`.
2.  **Mock Firebase Firestore SDK**: Use `vi.mock('firebase/firestore')` to mock Firestore functions like `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc` and `query`. This will prevent actual database calls during tests. Ensure your mocks return predictable data or throw specific errors for test scenarios.
3.  **Implement tests for `addNailItem`**:
    *   Test a successful item addition.
    *   Test error handling (e.g., if `addDoc` throws an error).
4.  **Implement tests for `getNailItems`**:
    *   Test successful retrieval of an empty list.
    *   Test successful retrieval of multiple items.
    *   Test error handling (e.g., if `getDocs` throws an error).
5.  **Implement tests for `updateNailItem`**:
    *   Test a successful item update.
    *   Test error handling (e.g., if `updateDoc` throws an error).
6.  **Implement tests for `deleteNailItem`**:
    *   Test a successful item deletion.
    *   Test error handling (e.g., if `deleteDoc` throws an error).
7.  **Run tests**: Use `npm test` or `vitest` to ensure all new tests pass.
8.  **Lint and Build**: Run `npm run lint && npm run build` to verify code quality and build integrity.

Focus on mocking the Firebase SDK interactions and verifying that the `firestore.ts` functions correctly call these mocked methods with the expected arguments and handle their responses (success/failure) appropriately. Prioritize `addNailItem` and `getNailItems` if the line limit is a concern, but ideally, cover all four core CRUD operations.
