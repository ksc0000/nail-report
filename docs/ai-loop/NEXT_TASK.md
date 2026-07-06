# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task addresses the "Test coverage" aspect by adding unit tests for a critical utility file.

## Objective

Add unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. The tests should cover the main CRUD operations (e.g., adding, fetching, updating, deleting nail items or tags) and handle Firebase SDK mocking appropriately.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prefer not to alter core logic)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only if Vitest or testing-library configuration is missing and *minimal* changes are required, e.g., adding a test script, but *no new npm dependencies*)
- `vite.config.ts` (if minimal Vitest configuration is needed, but prefer it to be pre-existing)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files outside the `src/` directory other than `package.json` or `vite.config.ts` if strictly necessary for testing setup.

## Requirements

- Keep diff ≤ 150 lines.
- Create `src/__tests__/firestore.test.ts` and add tests for functions in `src/lib/firestore.ts`.
- Mock Firebase Firestore SDK calls (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`) using `vi.mock` to ensure tests run in isolation without connecting to actual Firebase.
- Focus on testing the logic of the helper functions, not the Firebase SDK itself.
- At a minimum, test the `addNailItem`, `getNailItems`, `updateNailItem`, and `deleteNailItem` (or similar core CRUD) functions if they exist and are testable.
- Run `npm test` successfully.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---

**Acceptance Criteria:**

1.  A new test file `src/__tests__/firestore.test.ts` exists.
2.  The test file contains `describe` and `it` blocks with meaningful test names covering the main `src/lib/firestore.ts` helper functions.
3.  Firebase Firestore SDK calls are mocked using `vi.mock` to prevent actual network requests.
4.  `npm test` runs successfully with the new tests passing.
5.  The total diff for the PR is less than 150 lines.

**Required Test Commands:**

```bash
npm test
npm run build
npm run lint
```
