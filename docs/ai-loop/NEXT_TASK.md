```markdown
# Worker Prompt Template

## Context

The product roadmap prioritizes improving test coverage in Phase 2.1. This task focuses on adding foundational unit tests for Firebase Firestore helper functions, which are critical for application stability.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing, if necessary)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (minor additions if strictly necessary for mocking, but avoid if possible)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files outside `src/` except for `vitest.config.ts` if strictly needed.

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Worker prompt

Write unit tests for the helper functions in `src/lib/firestore.ts`.

1.  **Identify Functions**: Examine `src/lib/firestore.ts` and identify key exported helper functions that interact with Firestore (e.g., `addNailItem`, `updateNailItem`, `deleteNailItem`, `getNailItems`, `addPublicShare`, `deletePublicShare`, etc.).
2.  **Create Test File**: Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
3.  **Mock Firebase SDK**: Use `vitest` and `vi.mock` to mock Firebase SDK functions (`getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`, `query`, `where`, etc.) to prevent actual network calls during tests. Ensure mocks return predictable values for different test scenarios.
4.  **Write Tests**: For at least one or two of the identified helper functions, write comprehensive unit tests covering:
    *   Successful execution with valid inputs.
    *   Error handling (e.g., if a Firestore operation fails).
    *   Correct data transformation or interaction with mocked Firebase functions.
5.  **Refactor for Testability**: If necessary, make minor modifications to `src/lib/firestore.ts` to improve testability (e.g., exporting functions that were not previously exported, or making dependencies injectable, but prefer minimal changes).

### Acceptance Criteria

-   A new test file, `src/__tests__/firestore.test.ts`, is added.
-   At least one core Firestore helper function from `src/lib/firestore.ts` (e.g., `addNailItem` or `getNailItems`) has dedicated unit tests.
-   Firebase SDK interactions are fully mocked using `vi.mock` to ensure tests are isolated and do not touch real Firebase services.
-   All new tests pass.

### Required Test Commands

```bash
npm test
npm run build
npm run lint
```
```
