# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, focusing on improving stability, test coverage, and UX. The current state is in Phase 2.0. This task addresses "2.1 Test coverage" by adding unit tests for core Firebase Firestore helper functions.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments if needed for testability)
- `src/__tests__/firestore.test.ts` (new test file)
- `package.json` (only if Vitest setup needs a script, but no new dependencies)
- `vite.config.ts` (if Vitest configuration is needed)

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

## Worker Prompt

Your task is to add comprehensive unit tests for the helper functions within `src/lib/firestore.ts`.

1.  **Create a new test file:** `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:** Use `vitest` and `vi.mock` to mock Firebase SDK dependencies (e.g., `firebase/firestore` functions like `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`). Ensure tests do not interact with actual Firebase services.
3.  **Test key functions:** Write tests for the primary CRUD and retrieval functions in `src/lib/firestore.ts`, such as `getNailItems`, `addNailItem`, `updateNailItem`, and `deleteNailItem`.
4.  **Cover edge cases:** Include tests for successful operations, error handling (e.g., mocking rejected promises from Firebase functions), and possibly empty states.
5.  **Run tests:** Ensure all new tests pass by running `npm run test`.

**Acceptance Criteria:**
- A new file `src/__tests__/firestore.test.ts` is added.
- The new test file contains unit tests for functions in `src/lib/firestore.ts`.
- Firebase SDK calls are appropriately mocked, preventing actual service interaction.
- All new tests pass when running `npm run test`.

## Suggested next task

Add loading skeleton to nail item list (`src/App.tsx`).
