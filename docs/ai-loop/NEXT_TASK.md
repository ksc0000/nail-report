```markdown
# Worker Prompt Template

## Context

The current phase is "Phase 2 - Active", focusing on stability, test coverage, and UX. This task addresses "2.1 Test coverage" by adding unit tests for a core Firebase helper library.

## Objective

Add unit tests for helper functions in `src/lib/firestore.ts` using Vitest, specifically focusing on mocking Firebase Firestore SDK methods.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability, e.g., exports)
- `src/__tests__/firestore.test.ts` (new file)
- `vite.config.ts` (if necessary for Vitest configuration, but unlikely for basic setup)

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

Implement unit tests for the functions within `src/lib/firestore.ts`.

1.  **Create a new test file:** `src/__tests__/firestore.test.ts`.
2.  **Use Vitest** as the test runner. Ensure you can run `npm run test` (or similar, if configured) to execute these tests.
3.  **Mock the Firebase Firestore SDK:** Implement mocks for Firebase Firestore methods that `src/lib/firestore.ts` functions interact with (e.g., `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`). The goal is to test the logic of *our* helper functions, not the Firebase SDK itself. Refer to Vitest's `vi.mock` capabilities for mocking modules and functions.
    *   A good starting point for mocking would be `firebase/firestore`.
4.  **Write tests for at least two core functions** from `src/lib/firestore.ts`. Focus on functions that perform CRUD operations. Examples include:
    *   `getNailItems`: Test its ability to fetch and format data.
    *   `addNailItem`: Test its ability to call `addDoc` with correct arguments and return value.
    *   Ensure your tests cover successful execution paths and at least one basic error scenario (e.g., a Firestore operation failing).
5.  **Ensure test data is predictable:** Use mock data that you control within your tests.
6.  **Maintain high code quality:** Follow existing code style and best practices.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
