# Worker Prompt Template

## Context

The project is entering Phase 2, focusing on stability, test coverage, and UX improvements. The first area of focus is test coverage, as outlined in Phase 2.1 of the roadmap. This task initiates the process of adding unit tests to the core application logic.

## Objective

Implement Vitest unit tests for key helper functions within `src/lib/firestore.ts`. The goal is to add foundational tests for Firestore interactions, specifically covering item creation and retrieval.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments if necessary for testability)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (minor adjustments for Vitest configuration, if needed)

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

Your task is to add unit tests for `src/lib/firestore.ts` using Vitest.

1.  **Create a new test file:** Add `src/__tests__/firestore.test.ts`.
2.  **Configure Vitest:** Ensure Vitest is configured to run these tests. If `vite.config.ts` needs changes for Vitest setup, make only the minimal necessary modifications.
3.  **Mock Firebase SDK:** Use `vi.mock` to mock Firebase SDK functions (e.g., `getFirestore`, `collection`, `addDoc`, `getDocs`, `query`, etc.) to isolate `firestore.ts` logic from actual Firebase calls during tests.
4.  **Write tests for:**
    *   `addNailItem`: Test that it correctly calls the mocked Firebase functions with the expected arguments when adding a new item.
    *   `getNailItems`: Test that it correctly retrieves and transforms data from mocked Firebase functions.
    *   If time and line budget allows, also cover `updateNailItem` or `deleteNailItem`. Prioritize `addNailItem` and `getNailItems` if the diff is getting large.

## Acceptance Criteria

- A new test file `src/__tests__/firestore.test.ts` is created.
- The `addNailItem` and `getNailItems` functions in `src/lib/firestore.ts` have corresponding unit tests.
- Firebase SDK calls within `firestore.ts` are effectively mocked using `vi.mock`.
- All tests pass when running `npm test`.
- The codebase remains clean, and all `npm run lint` and `npm run build` checks pass.

## Required test commands

```bash
npm test
npm run build
npm run lint
```
