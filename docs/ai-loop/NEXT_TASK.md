```markdown
# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. A key item in this phase is adding unit tests for Firebase helper functions. This task specifically targets `src/lib/firestore.ts`.

## Objective

Implement unit tests for the `addNailItem` and `getNailItems` helper functions within `src/lib/firestore.ts` using Vitest and Firebase SDK mocking.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally not)
-   `src/__tests__/lib/firestore.test.ts` (new file for tests)
-   Any necessary mock files within `src/__mocks__/` or similar.

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (do not add new npm packages, assume Vitest is already a `devDependency`)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Ensure tests effectively mock the Firebase Firestore SDK.
-   Provide reasonable test coverage for `addNailItem` and `getNailItems` functions.
-   Report follow-up items as comments, not additional code.

## Worker Prompt

Your task is to add unit tests for the `addNailItem` and `getNailItems` functions located in `src/lib/firestore.ts`.

1.  **Create a new test file:** Create `src/__tests__/lib/firestore.test.ts`.
2.  **Configure Vitest mocking:**
    *   Use `vi.mock` to mock the Firebase Firestore SDK (e.g., `firebase/firestore`).
    *   Focus on mocking the necessary functions like `collection`, `doc`, `addDoc`, `getDocs`, `query`, `where` etc., as they would be called by `addNailItem` and `getNailItems`.
    *   Ensure the mocks return predictable data or resolve/reject promises as appropriate for testing success and error paths.
3.  **Write tests for `addNailItem`:**
    *   Test successful addition of a nail item, verifying `addDoc` is called with the correct arguments and that the function returns the expected document ID.
    *   Test error handling if `addDoc` fails.
4.  **Write tests for `getNailItems`:**
    *   Test successful retrieval of nail items, ensuring `getDocs` (or equivalent query execution) is called correctly and that the function returns parsed `NailItem` objects.
    *   Test cases with no items, and with multiple items.
    *   Test error handling if the retrieval process fails.
5.  **Run tests:** Use `npm test` or `vitest` to confirm all new tests pass.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
```
