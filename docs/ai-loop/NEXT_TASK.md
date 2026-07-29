# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses Phase 2.1, which aims to increase test coverage for critical application logic.

## Objective

Add unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (for minor adjustments if needed to enable testing)
- `src/__tests__/` (create new test files, e.g., `src/__tests__/firestore.test.ts`)
- `src/App.css` (no changes expected for this task)
- `package.json` (for adding test scripts if missing, but no new npm dependencies)

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

Implement unit tests for the functions defined in `src/lib/firestore.ts`.

1.  **Create a new test file**: Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK**: Use `vitest`'s mocking capabilities (`vi.mock`) to mock the Firebase Firestore SDK. Specifically, mock `getFirestore`, `collection`, `doc`, `getDocs`, `getDoc`, `addDoc`, `updateDoc`, `deleteDoc` and any other Firestore-related functions used in `src/lib/firestore.ts`. The mocks should simulate successful operations and potential errors.
3.  **Test core functions**: Write tests for the following functions, at a minimum:
    *   `getNailItems`
    *   `addNailItem`
    *   `updateNailItem`
    *   `deleteNailItem`
    *   `getPublicShare`
    *   `addPublicShare`
    *   `updatePublicShare`
    *   `deletePublicShare`
4.  **Cover success and error cases**: For each function, include tests that cover successful data retrieval/manipulation and scenarios where Firestore operations might fail (e.g., throwing an error).
5.  **Assert data integrity and function calls**: Use Vitest's `expect` assertions to verify that functions return expected values and that the mocked Firestore methods are called with the correct arguments.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
