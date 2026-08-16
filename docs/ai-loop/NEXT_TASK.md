```markdown
# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. Specifically, Phase 2.1 aims to increase test coverage, starting with `src/lib/` helper functions. This task addresses that goal by adding unit tests for Firestore-related helpers.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments if necessary for testability, but primarily adding tests *for* it)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (if minor configuration is needed for mocking, unlikely)

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

## Worker Prompt

Your task is to implement comprehensive unit tests for the functions defined in `src/lib/firestore.ts` using Vitest.

1.  **Create a new test file:** Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:** Use `vi.mock` to mock the Firebase Firestore SDK calls. Focus on mocking the necessary methods such as `doc`, `collection`, `addDoc`, `getDoc`, `updateDoc`, `deleteDoc`, `getDocs`, and any other Firestore-related functions used in `src/lib/firestore.ts`. Ensure your mocks allow testing both successful operations and error scenarios.
3.  **Test key functions:** Write tests for at least the following functions within `src/lib/firestore.ts`:
    *   `addNailItem`
    *   `getNailItems`
    *   `updateNailItem`
    *   `deleteNailItem`
    *   `getPublicShare`
4.  **Cover success and error cases:** For each function, ensure you have tests that cover:
    *   Successful execution (e.g., item added, retrieved, updated, deleted).
    *   Error handling (e.g., Firestore throws an error during an operation).
5.  **Clean up mocks:** Use `beforeEach` or `afterEach` to reset mocks between tests as needed to ensure test isolation.
6.  **Run tests:** Execute `npm test` and ensure all new tests pass.

**Acceptance Criteria:**

- A new test file `src/__tests__/firestore.test.ts` exists.
- The `src/lib/firestore.ts` helper functions (`addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, `getPublicShare`) are covered by unit tests.
- Tests include mocking the Firebase Firestore SDK.
- Both successful operation and error handling paths are tested for the mentioned functions.
- All new tests pass when `npm test` is run.
- The diff size is within the specified limit (≤ 150 lines).

**Required test commands:**

```bash
npm test
npm run build
npm run lint
```
```
