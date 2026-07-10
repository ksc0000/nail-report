```markdown
# Worker Prompt Template

## Context

The application needs improved test coverage, specifically for its Firebase helper functions. `src/lib/firestore.ts` contains crucial functions for interacting with the Firestore database, which currently lack unit tests.

## Objective

Add unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. The focus should be on demonstrating how to mock Firebase SDK interactions for isolated testing.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications, if strictly necessary for testability, but prioritize adding tests without changing existing logic)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `package.json` (only to confirm Vitest setup, no new dependencies)
- `vite.config.ts` (only to confirm Vitest setup)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Write unit tests for at least two key helper functions in `src/lib/firestore.ts` (e.g., a function to add a document and a function to retrieve one).
- Mock Firebase Firestore SDK methods (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `getDoc`, `updateDoc`, `deleteDoc`) using `vi.mock` to ensure tests are isolated from actual Firebase calls.
- Ensure the tests run successfully using Vitest.
- Keep the overall diff for this task ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---

## Worker Prompt

### Summary of what changed
Added a new test file `src/__tests__/lib/firestore.test.ts` containing unit tests for `src/lib/firestore.ts` helper functions. Firebase Firestore SDK interactions are mocked using `vi.mock` to provide isolated and fast tests.

### Changed files list
- `src/__tests__/lib/firestore.test.ts` (new file)

### Commands run and results
```bash
npm test
# <Output of Vitest tests, showing passed tests>

npm run build
# <Output of successful build>

npm run lint
# <Output of successful linting, or no errors>
```

### Known issues or limitations
- Only a subset of `src/lib/firestore.ts` functions are covered in this initial test file. Comprehensive test coverage for all functions will require follow-up tasks.
- The mocking strategy might need refinement as more complex Firebase interactions are tested in the future.

### Suggested next task
Add Vitest + unit tests for `src/lib/storage.ts` helpers, focusing on mocking Firebase Storage SDK interactions.
```
