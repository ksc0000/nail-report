# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task.

## Objective

Implement unit tests for selected helper functions in `src/lib/firestore.ts` using Vitest, specifically focusing on demonstrating Firebase SDK mocking.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes for testability, if necessary, but primarily for reading)
- `src/__tests__/firestore.test.ts` (new file for unit tests)
- `package.json` (for confirming existing dev dependencies, but **no modifications** to add new dependencies)
- Any other new files within `src/__tests__/` for test utilities/mocks if absolutely necessary and small.

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

## Worker prompt

Your task is to add unit tests for a few core helper functions in `src/lib/firestore.ts`. This aligns with Phase 2.1 Test coverage of the product roadmap.

Focus on demonstrating how to mock the Firebase SDK (Firestore specifically) using Vitest and `vi.mock()`.

**Specific steps:**

1.  Create a new test file: `src/__tests__/firestore.test.ts`.
2.  Inside this file, implement tests for at least **two** of the following functions from `src/lib/firestore.ts` (choose the simplest ones that demonstrate CRUD operations):
    *   `addDocument`
    *   `getDocument`
    *   `updateDocument`
    *   `deleteDocument`
    *   `getCollection` (or any function that fetches a list of documents)
3.  Ensure your tests effectively mock the Firebase Firestore SDK to prevent actual database calls. Use `vi.mock('firebase/firestore')` and mock necessary Firestore functions (e.g., `doc`, `collection`, `getDoc`, `setDoc`, `updateDoc`, `deleteDoc`).
4.  Verify that your tests cover successful operations and, if straightforward, basic error handling (e.g., a mock rejection).
5.  Do **not** install any new npm packages. Vitest and necessary Firebase dev dependencies are assumed to be already configured.

**Acceptance Criteria:**

*   A new file `src/__tests__/firestore.test.ts` exists.
*   This file contains unit tests for at least two functions from `src/lib/firestore.ts`.
*   The tests correctly use Vitest's mocking capabilities (`vi.mock`) to simulate Firebase Firestore SDK behavior without making actual network requests.
*   The tests pass successfully.
*   The overall diff is within the 150-line limit.

**Required Test Commands:**

```bash
npm test # To run the new unit tests
npm run build
npm run lint
```
