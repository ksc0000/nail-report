```markdown
# Worker Prompt Template

## Context

Phase 2.1 of the roadmap focuses on improving test coverage. The current task is to begin adding unit tests for the Firebase helper functions.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`. Focus on testing the core logic of these functions, mocking Firebase SDK interactions as needed.

## Allowed Scope

-   `src/lib/firestore.ts` (for potential minor adjustments to aid testing, but primarily to understand what to test)
-   `src/__tests__/firestore.test.ts` (new file for the tests)
-   `vite.config.ts` (for minimal Vitest configuration if absolutely necessary, e.g., for test environment setup)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files outside of `src/` except `vite.config.ts` if needed.

## Requirements

-   Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
-   Write unit tests for at least two key functions in `src/lib/firestore.ts` (e.g., `createNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
-   Use `vitest` and `vi.mock` to mock Firebase SDK methods (e.g., `getFirestore`, `collection`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`).
-   Ensure tests are isolated and do not interact with a live Firebase project.
-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint && npm run test` before finishing.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
```
