```markdown
# Worker Prompt Template

## Context

The current focus is on Phase 2 of the roadmap, which involves improving stability, test coverage, and UX. This task specifically targets "2.1 Test coverage" by adding unit tests for existing helper functions.

## Objective

Implement unit tests for the functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications only if necessary for testability, e.g., exporting unexported functions)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (if minor adjustments are needed for testing Firebase SDK mocking)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies as necessary for isolated unit testing. Refer to existing Vitest examples in the project if available, or common patterns for mocking Firebase.
- Cover functions like `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, etc., if they exist and are testable. Focus on the core CRUD operations.
- Ensure tests assert successful operations and handle potential error scenarios (e.g., Firestore throwing an error).
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---

# Worker Prompt

## Summary

The task is to write unit tests for the helper functions in `src/lib/firestore.ts` using Vitest. This involves creating a new test file, `src/__tests__/firestore.test.ts`, and mocking Firebase SDK interactions to test the functions in isolation.

## Changed Files

- `src/__tests__/firestore.test.ts` (new file)
- `src/lib/firestore.ts` (minor changes if needed for testability, e.g., exporting a helper function)

## Commands Run and Results

```bash
# To install Vitest if not already installed (check package.json first)
# npm install -D vitest

# To run tests
npm test

# To build and lint
npm run build && npm run lint
```
(Include actual output from running these commands.)

## Known Issues or Limitations

(Any issues encountered during testing or implementation, e.g., difficulty mocking a specific Firebase function.)

## Suggested Next Task

Add Vitest + unit tests for `src/lib/storage.ts` helpers.
```
