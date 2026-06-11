# Worker Prompt Template

## Context

The project is in Phase 2, focusing on improving stability, test coverage, and UX. The current focus is on adding unit tests to critical helper functions.

## Objective

Implement initial unit tests for helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing, if necessary)
- `src/__tests__/firestore.test.ts` (new test file)
- `vite.config.ts` (for Vitest configuration, if not already set up)

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

Your task is to add unit tests for functions in `src/lib/firestore.ts`.

1.  **Vitest Setup**: Ensure Vitest is correctly configured in `vite.config.ts`. If not already present, add basic Vitest configuration.
2.  **Create Test File**: Create a new test file `src/__tests__/firestore.test.ts`.
3.  **Implement Tests**: Write unit tests for at least one or two core functions in `src/lib/firestore.ts`. Good candidates include:
    *   `getNailItems`
    *   `addNailItem`
    *   `updateNailItem`
    *   `deleteNailItem`
    Choose the simplest one(s) to test first to keep the diff small.
4.  **Mock Firebase SDK**: Use `vi.mock` to mock Firebase SDK interactions (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`) to ensure tests are isolated and do not interact with actual Firebase services.
5.  **Assertions**: Use Vitest's assertion library to verify the behavior of the tested functions.
6.  **Run Tests**: Ensure all new tests pass by running `npm test`.
7.  **Lint and Build**: Ensure `npm run lint` and `npm run build` pass.

Keep the scope focused on initial test coverage for `firestore.ts` to ensure the PR remains small and reviewable. If `src/lib/firestore.ts` functions are not easily testable (e.g., not exported), make minimal modifications to export them while keeping backward compatibility.
