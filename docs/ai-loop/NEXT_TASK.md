```markdown
# Worker Prompt Template

## Context

The current phase is "Phase 2: Improve stability, test coverage, and UX." The immediate objective is to improve test coverage, specifically for Firebase helper functions. This task focuses on `src/lib/firestore.ts` to establish a testing pattern for Firestore interactions.

## Objective

Add Vitest unit tests for a few selected helper functions within `src/lib/firestore.ts`, demonstrating the mocking of the Firebase Firestore SDK.

## Allowed Scope

- `src/lib/firestore.ts` (for minor modifications to enable testing, e.g., exporting unexported functions if necessary, though ideally not needed)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (if minor adjustments for mocking are required, but avoid adding new dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Modifying `src/App.css` or other unrelated CSS files.

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Mock the Firebase Firestore SDK using `vi.mock` to prevent actual database calls.
- Write unit tests for at least two representative functions from `src/lib/firestore.ts` (e.g., one for adding data and one for retrieving data).
- Ensure tests verify correct function behavior, including arguments passed to the mocked Firebase SDK methods.
- Run `npm run build && npm run lint` before finishing.
- Run `npm test -- src/__tests__/lib/firestore.test.ts` to verify tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---

## Worker Prompt

### Summary

The worker will create a new test file (`src/__tests__/lib/firestore.test.ts`) and add Vitest unit tests for a couple of core functions within `src/lib/firestore.ts`. This involves setting up proper mocks for the Firebase Firestore SDK to ensure tests are isolated and don't interact with a live database.

### Changed files

- `src/lib/firestore.ts` (if minor adjustments needed for testability, otherwise none)
- `src/__tests__/lib/firestore.test.ts` (new file)

### Commands to run

1.  Inspect `src/lib/firestore.ts` to identify two suitable functions for initial test coverage (e.g., `addNailItem` and `getNailItems`, or similar CRUD operations).
2.  Create `src/__tests__/lib/firestore.test.ts`.
3.  Implement `vi.mock('firebase/firestore', ...)` to mock the necessary Firestore functions (`getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`, `query`, `where`, `getDocs`, etc., depending on the chosen functions).
4.  Write `describe` blocks and `it` tests for the chosen functions, asserting their behavior and interaction with the mocked Firestore SDK.
5.  Execute `npm test -- src/__tests__/lib/firestore.test.ts` and ensure all tests pass.
6.  Execute `npm run build && npm run lint` and address any issues.

### Acceptance Criteria

- A new file `src/__tests__/lib/firestore.test.ts` exists.
- This file contains at least two passing unit tests for functions defined in `src/lib/firestore.ts`.
- The tests successfully mock the Firebase Firestore SDK.
- `npm test -- src/__tests__/lib/firestore.test.ts` exits with a passing status.
- `npm run build` and `npm run lint` complete without errors or warnings.

### Suggested next task

Add loading skeleton to the nail item list in `src/App.tsx` and related components to improve UX during data fetching.
```
