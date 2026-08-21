```markdown
# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. The current focus is on enhancing test coverage.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. This involves adding new test files and mock implementations as needed to isolate the Firestore helper functions.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prefer not to alter functionality)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (if minor adjustments are required for mocks, but prefer to keep changes minimal)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` (not relevant to this task)

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two key helper functions in `src/lib/firestore.ts`, such as `addNailItem` and `getNailItems`.
- Use `vi.mock` to mock Firebase SDK dependencies (e.g., `firebase/firestore`) to ensure true unit isolation.
- Ensure tests cover basic success cases and error handling where applicable for the chosen functions.
- Run `npm run build && npm run lint && npm test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to add unit tests for the Firebase Firestore helper functions located in `src/lib/firestore.ts`.

1.  **Create a new test file**: Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK**: Within this test file, use `vi.mock` to mock the `firebase/firestore` module and its relevant functions (e.g., `collection`, `addDoc`, `getDocs`, `query`, `where`, `orderBy`, `doc`, `updateDoc`, `deleteDoc`). This will allow you to test `src/lib/firestore.ts` functions in isolation without actual Firebase calls.
3.  **Write tests**: Implement unit tests for at least two core functions in `src/lib/firestore.ts`. Good candidates include:
    *   `addNailItem`: Test successful addition.
    *   `getNailItems`: Test successful retrieval with mocked data.
    *   Ensure to cover both successful execution paths and potential error scenarios (e.g., a mocked Firestore operation throwing an error).
4.  **Verification**: Before completing the task, run the following commands and include their output in your summary:
    *   `npm run build`
    *   `npm run lint`
    *   `npm test` (verify tests pass)

Remember to keep the PR focused and within the 150-line diff limit. Report any follow-up items as comments in your final output, not as additional code.
```
