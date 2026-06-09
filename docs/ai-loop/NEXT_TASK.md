# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task addresses the first item in the test coverage section (2.1), focusing on foundational unit tests for Firebase helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/firestore.ts` (modifications only if strictly necessary for testability, e.g., exporting a helper)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `src/__tests__/setup.ts` (if global test setup is needed, but prefer local mocks)
- `vite.config.ts` (minor additions for test configuration, if strictly needed for Vitest)

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

## Worker prompt

1.  **Create Test File:** Create a new test file at `src/__tests__/lib/firestore.test.ts`.
2.  **Implement Unit Tests:**
    *   Write comprehensive unit tests for the functions exported from `src/lib/firestore.ts`.
    *   Focus on core CRUD operations: `addItem`, `updateItem`, `deleteItem`, `getItems`, and any other public helper functions present in the file.
3.  **Mock Firebase SDK:**
    *   Use Vitest's mocking capabilities (`vi.mock`) to mock Firebase SDK interactions (specifically Firestore). This ensures tests are isolated and don't make actual network requests.
    *   Mock the `getFirestore`, `collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`, `getDocs`, `query`, `where`, `orderBy` functions as needed.
4.  **Cover Scenarios:**
    *   Test successful operations (e.g., item added, updated, deleted, retrieved).
    *   Test error handling where applicable (e.g., if a Firestore operation fails).
5.  **Configuration (if needed):** If Vitest requires minor configuration in `vite.config.ts` to recognize the test files or enable specific features for testing Firebase modules, add only the necessary minimal configuration. Assume Vitest is already installed as a dev dependency.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
