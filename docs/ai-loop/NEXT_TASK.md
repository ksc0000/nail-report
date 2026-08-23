# Worker Prompt Template

## Context

The application is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage improvements by targeting core Firebase helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (for minor test-related adjustments if necessary, but primarily adding tests)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (for minor test environment adjustments if necessary)

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

---

## Worker Prompt

### Summary of what changed

This task involves creating a new test file `src/__tests__/lib/firestore.test.ts` and adding unit tests for the functions defined in `src/lib/firestore.ts`. Specifically, focus on testing functions that interact with the Firestore SDK, such as `addNailItem`, `updateNailItem`, `deleteNailItem`, and any retrieval functions like `getNailItems` or `getPublicShare`. Mock the Firebase SDK as necessary to ensure tests are isolated and do not require a live Firebase connection. The goal is to establish a robust testing foundation for our Firebase interactions.

### Changed files list

- `src/__tests__/lib/firestore.test.ts` (new file)
- `src/lib/firestore.ts` (potential minor modifications for testability, e.g., exporting unexported functions, but keep changes minimal)
- `vitest.config.ts` (if any specific Vitest configuration is needed for Firebase mocking)

### Commands run and results

```bash
# Run tests to ensure new tests pass and existing ones are unaffected
npm run test

# Build the project to catch any compilation errors
npm run build

# Lint the project to ensure code quality standards are met
npm run lint
```

Expected results:
- `npm run test`: All tests pass, including the newly added Firestore unit tests.
- `npm run build`: Build succeeds with no errors.
- `npm run lint`: Linting passes with no errors.

### Known issues or limitations

- The Firebase SDK mocking strategy should be robust enough to cover various scenarios (success, error, loading). Initial implementation may focus on happy path and basic error handling.
- Complex queries or real-time listeners might require more advanced mocking, which can be handled in subsequent tasks.

### Suggested next task

Add loading skeleton to nail item list (`src/App.tsx`)
