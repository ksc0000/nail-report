# Worker Prompt Template

## Context

The product roadmap focuses on improving stability, test coverage, and UX in Phase 2. The current task is to begin addressing test coverage.

## Objective

Add Vitest unit tests for key helper functions within `src/lib/firestore.ts`. This task aims to establish a testing pattern for Firestore interactions and improve the robustness of data operations.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability, if necessary, but primarily adding tests)
- `src/__tests__/` (create new test files, e.g., `src/__tests__/firestore.test.ts`)
- `package.json` (only for adding a `test` script if not already present, but no new `dependencies` or `devDependencies`)
- `vite.config.ts` (minor adjustments for Vitest setup, if absolutely necessary, but prioritize existing setup)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` or any other CSS files

## Requirements

- Keep diff ≤ 150 lines. Focus on 1-2 core helper functions initially (e.g., `getNailItems`, `addNailItem`).
- Use Vitest for writing tests.
- Mock the Firebase SDK (`firestore`) using `vi.mock` as appropriate to isolate unit tests from actual Firebase calls.
- Ensure tests run successfully.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

Implement Vitest unit tests for a subset of the functions in `src/lib/firestore.ts`.

Specifically:
1.  Create a new test file: `src/__tests__/firestore.test.ts`.
2.  Add a test suite for `src/lib/firestore.ts`.
3.  Implement tests for the `getNailItems` helper function. This should involve mocking `firebase/firestore` to simulate successful data fetching and potential errors, ensuring the helper correctly processes snapshots and handles exceptions.
4.  Ensure that the tests cover basic success cases and error handling.
5.  If Vitest is not fully configured, add a `test` script to `package.json` that runs `vitest`.

This task focuses on establishing a robust testing foundation for our Firebase interaction layer.
