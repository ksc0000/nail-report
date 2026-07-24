```markdown
# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses Phase 2.1: Test coverage, by introducing unit tests for core Firebase interactions.

## Objective

Implement Vitest unit tests for the `addNailItem` and `getNailItems` functions located in `src/lib/firestore.ts`. This involves setting up mocks for the Firebase SDK to isolate the logic being tested.

## Allowed Scope

- `src/lib/firestore.ts` (for potential minor adjustments to aid testability, though ideally none)
- `src/__tests__/` (for new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (if Vitest configuration is missing or needs minor adjustments for mocking)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines. Focus on `addNailItem` and `getNailItems` for `src/lib/firestore.ts`.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Use `vitest` and mock the Firebase SDK (e.g., `firebase/firestore`) to prevent actual database calls.
- Ensure tests cover successful operations and basic error handling scenarios for the specified functions.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

### Worker prompt

Jules, your task is to add unit tests for the `addNailItem` and `getNailItems` functions in `src/lib/firestore.ts`.

1.  **Create a new test file**: Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK**: Use `vi.mock` to mock `firebase/firestore`. Ensure that mock implementations for functions like `collection`, `addDoc`, `getDocs`, `query`, `where`, and `orderBy` are provided. The mocks should return predictable values or throw controlled errors.
3.  **Test `addNailItem`**:
    *   Test successful addition of a nail item.
    *   Test that the correct Firestore collection (`nailItems`) is targeted.
    *   Test error handling (e.g., if `addDoc` fails).
4.  **Test `getNailItems`**:
    *   Test successful retrieval of nail items for a given user.
    *   Test that the function correctly queries the `nailItems` collection with the `userId` and applies sorting (`createdAt`).
    *   Test that it handles an empty list of items gracefully.
    *   Test error handling (e.g., if `getDocs` fails).
5.  **Run tests**: Execute `npm run test` to verify the new tests pass.
6.  **Lint and Build**: Ensure the project still builds and passes lint checks: `npm run build && npm run lint`.
```
