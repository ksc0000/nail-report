# Worker Prompt Template

## Context

The application is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage efforts by adding unit tests for core Firebase helper functions.

## Objective

Add Vitest unit tests for helper functions within `src/lib/firestore.ts`, ensuring the Firebase SDK is properly mocked.

## Allowed Scope

- `src/lib/firestore.ts` (Minor modifications, e.g., for testability, if strictly necessary)
- `src/__tests__/lib/firestore.test.ts` (New file for tests)
- `src/App.css` (No changes expected, but allowed for general CSS improvements if any follow-ups)
- `vite.config.ts` (Minimal additions to Vitest configuration if required for `vi.mock` or test setup, assuming Vitest is already installed)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval; Vitest is assumed to be an existing dev dependency based on the roadmap)
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

Implement unit tests for the functions defined in `src/lib/firestore.ts`.

1.  **Create a new test file:** `src/__tests__/lib/firestore.test.ts`.
2.  **Set up Vitest:** Ensure Vitest is configured to run tests (it's assumed to be already installed as a dev dependency). If minimal configuration for `vi.mock` is needed in `vite.config.ts`, add it.
3.  **Mock Firebase SDK:** Use `vi.mock` to mock Firestore-related functions (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`) to isolate `firestore.ts` logic.
4.  **Write Unit Tests:** Focus on testing the core CRUD operations provided by `src/lib/firestore.ts`.
    *   Prioritize testing `addNailItem`, `getNailItems`, `updateNailItem`, and `deleteNailItem`.
    *   Ensure tests cover successful operations and basic error scenarios (e.g., if a Firestore operation fails).
5.  **Run tests:** Execute `npm test` or `vitest` to verify the new tests pass.

This task aims to lay the groundwork for comprehensive test coverage as outlined in Phase 2.1 of the roadmap.
