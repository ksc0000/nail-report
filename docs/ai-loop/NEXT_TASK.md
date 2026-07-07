# Worker Prompt Template

## Context

The current phase is 2.0, focusing on improving stability, test coverage, and UX. This task addresses Phase 2.1 (Test coverage) by adding unit tests for core Firestore helper functions.

## Objective

Implement comprehensive unit tests for the functions defined in `src/lib/firestore.ts` using Vitest, ensuring that Firebase SDK calls are properly mocked.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications only if necessary for testability, e.g., exporting unexported functions if needed, but prefer to test public API)
-   `src/__tests__/firestore.test.ts` (new file)
-   `vite.config.ts` (add test configuration if not already present, e.g., `globals: true` or `setupFiles`)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files outside the `src/` directory other than `vite.config.ts`

## Requirements

-   Create a new test file: `src/__tests__/firestore.test.ts`.
-   Write unit tests for the key functions in `src/lib/firestore.ts`, such as `addNailItem`, `updateNailItem`, `deleteNailItem`, `getNailItems`, `getNailItem`, `getPublicShare`, `addPublicShare`, `updatePublicShare`, etc.
-   Utilize Vitest's mocking capabilities (`vi.mock`) to mock the Firebase Firestore SDK functions (`getFirestore`, `collection`, `doc`, `getDocs`, `getDoc`, `addDoc`, `updateDoc`, `deleteDoc`, etc.).
-   Ensure tests cover successful operations and, where applicable, basic error scenarios (e.g., `catch` blocks in the original functions).
-   Keep the diff for this task minimal, ideally under 150 lines, focusing on one test file.
-   Run `npm run build && npm run lint` successfully before finishing.
-   Run `npm test` and ensure all new tests pass.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
