# Worker Prompt Template

## Context

The product roadmap prioritizes improving stability and test coverage in Phase 2. This task focuses on implementing unit tests for core Firebase Firestore helper functions, which is a crucial step for ensuring application reliability.

## Objective

Implement exactly one bounded task from Phase 2 of the roadmap: Add Vitest unit tests for the helper functions in `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (for minor refactoring to enable testability, if necessary)
- `src/__tests__/lib/firestore.test.ts` (new test file)
- `src/lib/` (read-only for understanding helpers)

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

### Summary of what changed
This task will introduce a new test file, `src/__tests__/lib/firestore.test.ts`, containing Vitest unit tests for the functions defined in `src/lib/firestore.ts`. The tests will focus on mocking Firebase Firestore SDK interactions to verify the logic of the helper functions.

### Changed files list
- `src/lib/firestore.ts` (minor, if refactoring needed for testability, e.g., named exports)
- `src/__tests__/lib/firestore.test.ts` (new file)

### Commands run and results
```bash
# Install dependencies if needed (should already be done)
npm install

# Run tests
npm test src/__tests__/lib/firestore.test.ts
# Expected: All new tests pass successfully.

# Build and lint to ensure no regressions
npm run build
npm run lint
# Expected: Build succeeds and lint passes with no errors.
```

### Known issues or limitations
- The task focuses specifically on `src/lib/firestore.ts`. Other `lib` files will be tested in subsequent tasks.
- Mocking Firebase SDK can be complex; ensure mocks accurately represent Firebase behavior.
- Only unit tests are expected; no integration tests involving actual Firestore connections.

### Suggested next task
Add loading skeleton to nail item list (`src/App.tsx`)
