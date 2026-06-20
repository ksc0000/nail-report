```markdown
# Worker Prompt Template

## Context

The application is transitioning into Phase 2 of the roadmap, with a primary focus on improving stability and increasing test coverage for core utility functions. Establishing a solid testing foundation for Firebase interactions is a critical first step.

## Objective

Implement comprehensive unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest. This involves setting up Firebase SDK mocks and writing tests that cover the primary Firestore CRUD operations encapsulated within these helpers.

## Allowed Scope

-   `src/lib/firestore.ts` (minor adjustments for testability, if necessary)
-   `src/__tests__/lib/firestore.test.ts` (new file for unit tests)
-   `src/__mocks__/firebase/firestore.ts` (or similar new mock file if needed, following Vitest mocking patterns)
-   `vite.config.ts` (minimal additions for test configuration, e.g., setting up aliases for mocks, if needed)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Create a new test file at `src/__tests__/lib/firestore.test.ts`.
-   Utilize Vitest's mocking capabilities (`vi.mock`) to mock Firebase SDK methods (e.g., `getFirestore`, `collection`, `doc`, `getDoc`, `addDoc`, `updateDoc`, `deleteDoc`) to ensure tests are isolated and do not interact with actual Firebase services.
-   Write unit tests for key CRUD helper functions in `src/lib/firestore.ts`, such as `addDocument`, `getDocument`, `updateDocument`, and `deleteDocument`.
-   Include test cases for successful operations and basic error handling scenarios (e.g., `getDocument` for a non-existent document).
-   Ensure the overall diff for the pull request is kept at or below 150 lines.
-   Run `npm run build && npm run lint && npm run test` and ensure all pass before marking the task as complete.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
```
