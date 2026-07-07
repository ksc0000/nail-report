```markdown
# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task initiates the test coverage effort (Phase 2.1). The goal is to establish a testing foundation for core helper functions.

## Objective

Implement unit tests for key helper functions within `src/lib/firestore.ts` using Vitest, including setting up Firebase SDK mocking.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments if needed for testability, but focus on testing existing logic)
- `src/__tests__/` (create new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (only if absolutely necessary for Vitest configuration, but prefer to assume Vitest is already set up)
- `package.json` (only to add a `test` script if missing, no new dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval, except potentially adding `vitest` if it's not present and strictly necessary for its first use, but the roadmap implies it's chosen and available)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Worker prompt

Your task is to add unit tests for the `src/lib/firestore.ts` module.

1.  **Create a new test file:** `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:** Use `vi.mock` to mock the Firebase Firestore functions (e.g., `addDoc`, `getDocs`, `collection`, `query`, `orderBy`, etc.) that are used by the helper functions in `src/lib/firestore.ts`. Refer to Vitest's documentation for mocking modules.
3.  **Implement tests for `addNailItem`:**
    *   Write a test case to ensure `addNailItem` correctly calls the mocked `addDoc` function with the expected data.
    *   Verify it returns the expected data or ID.
4.  **Implement tests for `getNailItems`:**
    *   Write a test case to ensure `getNailItems` correctly calls the mocked Firestore query functions (e.g., `collection`, `query`, `getDocs`) with the expected arguments.
    *   Provide mocked return values for `getDocs` to simulate a list of nail items.
    *   Verify that the function processes and returns the mocked data in the expected format.
5.  **Ensure tests pass:** Run `npm test` and verify all new tests pass.

## Acceptance Criteria

- A new test file `src/__tests__/firestore.test.ts` is created.
- The Firebase Firestore SDK is appropriately mocked using `vi.mock`.
- Unit tests for `addNailItem` and `getNailItems` are present, cover basic functionality, and pass.
- `npm run build` and `npm run lint` execute without errors.

## Required test commands

```bash
npm test
npm run build
npm run lint
```

## Suggested next task

Add unit tests for `src/lib/storage.ts` helpers, specifically for image upload and deletion functions, including mocking Firebase Storage SDK.
```
