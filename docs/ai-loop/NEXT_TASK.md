```markdown
# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage improvements by adding unit tests for core Firestore helper functions.

## Objective

Implement unit tests for the helper functions in `src/lib/firestore.ts` using Vitest, specifically targeting CRUD operations for `nailItems`.

## Allowed Scope

-   `src/lib/firestore.ts` (minor modifications for testability if strictly necessary, but prefer to add tests without changing the original file)
-   `src/lib/__tests__/firestore.test.ts` (new file for tests)
-   `src/lib/auth.ts`, `src/lib/storage.ts` (read-only for mocking purposes)
-   `vite.config.ts` (minor additions for Vitest setup if not already configured for mocking)

## Forbidden Scope

-   `src/main.tsx`
-   `commands/`
-   `firestore.rules`, `storage.rules`
-   `package.json` deps (no new npm packages)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files outside of `src/` except for `vite.config.ts` if needed for Vitest setup.

## Requirements

-   Keep the total diff (additions + deletions) at or below 150 lines.
-   Create a new test file: `src/lib/__tests__/firestore.test.ts`.
-   Add tests for the `createNailItem`, `getNailItems`, `updateNailItem`, and `deleteNailItem` functions within `src/lib/firestore.ts`.
-   Use Vitest's `vi.mock` to mock Firebase SDK dependencies (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`).
-   Ensure tests are isolated and do not interact with actual Firebase services.
-   Run `npm run build && npm run lint` before finishing to ensure code quality and build integrity.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
```
