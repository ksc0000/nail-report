# Worker Prompt Template

## Context

The current phase focuses on improving stability, test coverage, and UX. This task directly addresses the "2.1 Test coverage" objective by adding unit tests to core helper functions.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (Minor modifications may be necessary to improve testability, but avoid significant refactoring.)
- `src/__tests__/firestore.test.ts` (New file for the unit tests.)
- `src/__tests__/*.ts` (Additional test files if needed for supporting mocks, though prefer inlining mocks in `firestore.test.ts` if possible.)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `vitest.config.ts` (assume Vitest is already configured)

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm test` before finishing.
- Focus on testing the individual helper functions within `firestore.ts`.
- Ensure Firebase SDK calls are appropriately mocked (e.g., `firebase/firestore`, `firebase/auth` if implicitly used via `getAuth`).
- Add tests for common success cases and relevant error scenarios.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

### Worker prompt

### Summary of Changes

This task will involve creating a new test file, `src/__tests__/firestore.test.ts`, and adding unit tests for the functions within `src/lib/firestore.ts`. The tests will mock Firebase SDK dependencies to ensure isolated testing of the helper logic. Minor adjustments to `src/lib/firestore.ts` for better testability are acceptable but should be minimal.

### Changed Files

- `src/lib/firestore.ts` (potentially minor modifications for testability)
- `src/__tests__/firestore.test.ts` (new file)

### Commands to Run

```bash
npm test
npm run build
npm run lint
```

Expected output for `npm test` should show new tests passing for `firestore.ts` helpers. `npm run build` and `npm run lint` should complete without errors.

### Known Issues or Limitations

- The task assumes Vitest is already configured in the project. If `npm test` does not run Vitest tests, the worker should report this as an issue rather than attempting to configure Vitest.
- Focus on covering the most critical helper functions first to stay within the diff limit. Further test coverage can be a follow-up task.

### Suggested Next Task

Add loading skeleton to nail item list (`src/App.tsx`).
