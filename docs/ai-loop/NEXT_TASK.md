```markdown
# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses Phase 2.1: Test coverage, by adding unit tests for core Firebase helper functions.

## Objective

Implement unit tests for one or two helper functions within `src/lib/firestore.ts` using Vitest. This task aims to establish a testing foundation for Firestore-related logic.

## Allowed Scope

- `src/lib/firestore.ts` (for understanding the functions to be tested, no modification expected unless necessary for testability, e.g., exporting an internal helper)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/vitest.setup.ts` (if global mocks are needed for Firebase, though direct `vi.mock` in test file is preferred for specific modules)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

-   Create a new test file: `src/__tests__/firestore.test.ts`.
-   Use `vitest` as the test runner.
-   Mock Firebase Firestore SDK dependencies (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`) using `vi.mock('firebase/firestore')` to isolate the logic in `firestore.ts`.
-   Implement unit tests for **two** functions from `src/lib/firestore.ts`. Recommended candidates for this task are `getNailItems` and `addNailItem`.
-   Ensure tests cover successful execution paths and at least one error handling path for the selected functions.
-   Keep the overall diff small (aim for ≤150 lines).
-   Run `npm test` to ensure all tests pass.
-   Run `npm run build && npm run lint` before finishing to ensure code quality and build integrity.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

---
```
