# Worker Prompt Template

## Context

The current phase is "2.0 Improve stability, test coverage, and UX." The first item in the "Jules-ready Tasks" list, and also the first item under "2.1 Test coverage" in the roadmap, is to add unit tests for Firestore helper functions. This task aims to kickstart the test coverage efforts by focusing on the `src/lib/firestore.ts` file.

## Objective

Add unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, including Firebase SDK mocking as needed.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally not)
- `src/__tests__/lib/firestore.test.ts` (new file)
- `vitest.config.ts` (if absolutely necessary for initial setup, but prefer to assume basic Vitest is configured)
- `package.json` (only for adding `vitest` scripts if missing, not new dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval, `vitest` is considered a pre-approved testing tool)
- Firebase deploy commands
- Secrets and credentials
- Any other files not explicitly listed in "Allowed Scope"

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Write unit tests for at least two significant helper functions within `src/lib/firestore.ts`. Examples include functions that interact with `addDoc`, `getDocs`, `updateDoc`, or `deleteDoc`.
- Implement mocking for Firebase SDK dependencies (e.g., `firebase/firestore`) using `vi.mock` as necessary to isolate the functions under test.
- Ensure tests cover both successful execution and potential error cases for the chosen functions.
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` or `npm run test` (whichever is configured for Vitest) and ensure all new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
**Acceptance Criteria:**

1.  A new file `src/__tests__/lib/firestore.test.ts` exists.
2.  This file contains unit tests for at least two functions from `src/lib/firestore.ts`.
3.  Firebase Firestore SDK calls are appropriately mocked.
4.  All new tests pass.
5.  `npm run build` and `npm run lint` pass without errors or warnings.

**Required Test Commands:**

1.  `npm install` (to ensure `vitest` is installed if not already)
2.  `npm test` (or equivalent, to run Vitest tests)
3.  `npm run build`
4.  `npm run lint`
