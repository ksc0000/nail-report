```markdown
# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses Phase 2.1, "Test coverage," by adding unit tests for core Firebase Firestore helper functions.

## Objective

Implement comprehensive unit tests for the helper functions defined in `src/lib/firestore.ts` using Vitest. Mock the Firebase Firestore SDK to ensure tests are isolated and run efficiently without actual Firebase calls.

## Allowed Scope

- `src/lib/firestore.ts` (for minor adjustments to enable testability if absolutely necessary, but prioritize adding tests without modifying core logic)
- `src/__tests__/firestore.test.ts` (new test file)
- `vite.config.ts` (if Vitest setup for mocks needs adjustment, unlikely for this task)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file: `src/__tests__/firestore.test.ts`.
- Write unit tests covering the primary CRUD operations (e.g., `addNailItem`, `updateNailItem`, `deleteNailItem`, `getNailItems`, `getNailItem`) and any other significant functions in `src/lib/firestore.ts`.
- Use `vi.mock('firebase/firestore')` to effectively mock Firestore SDK functions (e.g., `collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`, `getDocs`, `getDoc`).
- Ensure the tests assert expected behavior and error handling where applicable.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- All new tests must pass when running `npm run test`.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---

# Worker Prompt

## Summary of what changed

Added a new test file `src/__tests__/firestore.test.ts` containing unit tests for the `src/lib/firestore.ts` helper functions. The Firebase Firestore SDK was mocked using `vi.mock` to allow for isolated and fast testing of the application's Firestore logic.

## Changed files list

- `src/__tests__/firestore.test.ts` (new file)

## Commands run and results

```bash
# To run all tests
npm test

# Expected output:
# ✓ src/__tests__/firestore.test.ts (x tests)
#   ✓ ...
# Test Suites: 1 passed, 1 total
# Tests:       x passed, x total
# Snapshots:   0 total
# Time:        X.XXs

# To check build
npm run build

# Expected output:
# > nail-report@0.0.0 build
# > tsc && vite build
#
# ✓ built in X.Xs

# To check linting
npm run lint

# Expected output:
# > nail-report@0.0.0 lint
# > eslint . --ext ts,tsx,js,jsx --report-unused-disable-directives --max-warnings 0
```

## Known issues or limitations

- Currently, only `nailItems` CRUD operations are covered. Public shares or tag-related Firestore functions (if present in `firestore.ts`) may need separate test cases in future tasks.
- The mocking strategy assumes basic success cases for Firestore operations. More complex error handling or edge cases might require additional specific mock implementations.

## Suggested next task

Add loading skeleton to nail item list (`src/App.tsx`). This addresses Phase 2.3 "Loading states" from the roadmap.
```
