# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task. Phase 2 prioritizes improving stability and test coverage. This task focuses on establishing unit tests for core Firebase helper functions.

## Objective

Implement Vitest unit tests for the helper functions defined in `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts`
- `src/__tests__/firestore.test.ts` (new file)
- `vite.config.ts` (if Vitest configuration or setup is required)
- `package.json` (only for adding `vitest` or related dev dependencies if not already present, but prefer using existing setup)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new *runtime* npm packages without human approval; dev dependencies for testing are acceptable if necessary, but ideally use existing `vitest` setup)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.
- Ensure Firebase SDK calls are properly mocked using `vitest.mock` to isolate the unit tests from actual Firebase interactions.
- Focus on testing the logic of the helper functions, not the Firebase SDK itself.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

### Worker prompt

The goal of this task is to add comprehensive unit tests for the helper functions located in `src/lib/firestore.ts`.

1.  **Create a new test file:** Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:** Use `vi.mock` to mock Firebase Firestore functions (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `getDoc`, `updateDoc`, `deleteDoc`, `getDocs`, `query`, `where`, `orderBy`, `limit`, `onSnapshot`) to prevent actual database calls during tests. Ensure `firebase/firestore` is mocked correctly.
3.  **Write unit tests:**
    *   For each exported function in `src/lib/firestore.ts` (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`, `getPublicShare`, `addPublicShare`, `deletePublicShare`), write a test suite.
    *   Cover common success cases.
    *   Consider edge cases if applicable (e.g., empty collections, item not found).
    *   Assert that the functions correctly interact with the mocked Firebase SDK (e.g., `addDoc` was called with correct arguments) and return expected data.
4.  **Verify existing setup:** Ensure `vitest` is correctly configured in `vite.config.ts` to run these tests. If `vitest` is not installed as a dev dependency, you may add it, but first check if it's already there.

**Acceptance Criteria:**
*   A new file `src/__tests__/firestore.test.ts` exists.
*   All significant helper functions in `src/lib/firestore.ts` have corresponding unit tests.
*   Firebase SDK calls are mocked.
*   Tests pass successfully (`npm test`).
*   The diff is within the specified line limit.

**Required Test Commands:**
```bash
npm test
npm run build
npm run lint
```
