# Worker Prompt Template

## Context

The `nail-report` application needs improved test coverage, starting with core Firebase helper functions. `src/lib/firestore.ts` contains crucial functions for interacting with Firestore, and adding unit tests for these will enhance stability and maintainability.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (for inspection and potential minor refactoring to enable testing, but primarily for understanding what to test)
- `src/__tests__/firestore.test.ts` (new test file)
- `src/__tests__/setup.ts` (if global Vitest setup is needed, but prefer local mocks for this task)
- `vite.config.ts` (if test config needs adjustment, but unlikely for basic unit tests)

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

Implement unit tests for several key functions in `src/lib/firestore.ts`.

1.  **Create a new test file:** `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:** Use `vi.mock` to mock `firebase/firestore` and `firebase/auth` to isolate the `firestore.ts` functions from actual Firebase calls. This includes mocking functions like `getFirestore`, `collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`, `getDocs`, `onSnapshot`, etc.
3.  **Test specific helper functions:** Focus on testing functions like `addNailItem`, `updateNailItem`, `deleteNailItem`, `getNailItems`, and `subscribeToNailItems`.
4.  **Cover success and error cases:** For at least `addNailItem` and `deleteNailItem`, write tests that cover both successful execution and expected error handling (e.g., if a Firestore operation fails).
5.  **Use Vitest assertions:** Write clear and concise tests using Vitest's assertion library.
6.  **Run tests:** Ensure all new tests pass by running `npm test`.

**Acceptance Criteria:**
- A new file `src/__tests__/firestore.test.ts` exists.
- The new test file contains unit tests for at least `addNailItem`, `updateNailItem`, and `deleteNailItem` from `src/lib/firestore.ts`.
- Firebase SDK functions are mocked using `vi.mock` to prevent actual Firebase calls.
- Both successful execution and error handling are covered for at least `addNailItem`.

**Required Test Commands:**
```bash
npm test
npm run build
npm run lint
```
