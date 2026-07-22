# Worker Prompt Template

## Context

The product roadmap is focused on Phase 2: improving stability, test coverage, and UX. This task focuses on improving test coverage for core Firebase helper functions. Vitest is already selected as the test runner, and mocking Firebase SDK is a known requirement.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (for inspection, no functional changes expected)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (only if minor Vitest configuration is strictly necessary, e.g., glob patterns)

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

Your task is to add comprehensive unit tests for the helper functions located in `src/lib/firestore.ts`.

1.  **Create a New Test File**: Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK**: Utilize `vi.mock` (Vitest's mocking API) to mock Firebase Firestore SDK dependencies (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`). The goal is to test the logic of `firestore.ts` functions in isolation, without actual interaction with Firebase.
3.  **Write Unit Tests**:
    *   Focus on covering the main CRUD operations: `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, and any other significant helper functions in `src/lib/firestore.ts`.
    *   Test both successful execution paths and error handling paths (e.g., what happens if `addDoc` rejects).
    *   Ensure tests are clean, readable, and use clear assertions.
4.  **No Functional Changes to `src/lib/firestore.ts`**: This task is solely about adding tests, not modifying the implementation of the helper functions themselves.

### Acceptance Criteria

- A new file `src/__tests__/firestore.test.ts` is created.
- The `firestore.test.ts` file contains unit tests for the majority of the exported functions from `src/lib/firestore.ts`.
- Firebase SDK dependencies are properly mocked within the tests.
- All new tests pass successfully when `npm test` is run.
- The diff for this task is ≤ 150 lines.

### Required Test Commands

```bash
npm install # Ensure all dependencies are up to date
npm run build
npm run lint
npm test src/__tests__/firestore.test.ts
```
