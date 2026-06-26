# Worker Prompt Template

## Context

The application needs improved test coverage as part of Phase 2 of the roadmap, focusing on stability. This task addresses the need for unit tests for core Firebase interaction helpers. Vitest is already configured for testing.

## Objective

Implement unit tests for helper functions in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (for understanding functions, minor refactoring to enable testing if absolutely necessary, but focus is on testing existing logic)
- `src/__tests__/` (e.g., `src/__tests__/firestore.test.ts` for new test files)
- `package.json` (only for adding/modifying existing `scripts` if `npm run test` is not yet defined, no new `dependencies` or `devDependencies`)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Worker prompt

The application needs improved test coverage, especially for its core Firebase interactions. Your task is to add unit tests for the helper functions located in `src/lib/firestore.ts`.

1.  **Create a new test file**: Create a new file named `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK**: Utilize `vi.mock` from Vitest to mock Firebase SDK functions and services (e.g., `firebase/firestore`). This ensures tests are isolated and do not interact with a live Firebase project.
3.  **Test helper functions**: Write unit tests for at least two key functions within `src/lib/firestore.ts` that interact with Firestore (e.g., `addNailItem`, `updateNailItem`, `getNailItems`, `deleteNailItem`, `subscribeToNailItems`). Focus on both successful execution and potential error handling scenarios.
4.  **Assertions**: Use Vitest's assertion library (`expect`) to verify function behavior, return values, and mock calls.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
