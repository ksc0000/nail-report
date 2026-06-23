# Worker Prompt Template

## Context

The application is in Phase 2, focusing on improving stability, test coverage, and user experience. A key area for improvement is adding comprehensive unit tests for core utility functions to ensure reliability. Vitest is already configured as the test runner.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, with a focus on mocking Firebase SDK dependencies.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments to functions for testability, if strictly necessary)
- `src/__tests__/firestore.test.ts` (or other appropriate test file names within `src/__tests__/`)
- `vite.config.ts` (for minimal Vitest configuration adjustments, if needed)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` dependencies (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Worker prompt

1.  Create a new test file, `src/__tests__/firestore.test.ts`.
2.  Write unit tests for the helper functions defined in `src/lib/firestore.ts`.
3.  Use `vitest` for testing.
4.  Crucially, mock Firebase SDK dependencies (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `getDoc`, `addDoc`, `updateDoc`, `deleteDoc`) to ensure tests are isolated and do not interact with actual Firebase services. The `vi.mock` utility should be used for this purpose.
5.  Focus on testing the primary CRUD operations and any other significant utility functions within `src/lib/firestore.ts`.
6.  Ensure adequate test coverage for the target file's functions.
7.  Verify that tests pass successfully.

**Acceptance Criteria:**
- A new test file `src/__tests__/firestore.test.ts` exists.
- This file contains unit tests that cover key functions in `src/lib/firestore.ts`.
- Firebase SDK calls are mocked to prevent actual service calls.
- All new tests pass.

**Required Test Commands:**
```bash
npm test
npm run build
npm run lint
```
