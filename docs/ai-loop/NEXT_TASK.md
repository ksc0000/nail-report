```markdown
# Worker Prompt Template

## Context

The application is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage sub-phase by adding unit tests for core Firebase Firestore helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if necessary for testing)
- `src/__tests__/firestore.test.ts` (new test file)
- `src/__tests__/` (other new test files as needed for `firestore.ts`)

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
- Run `npm run test` and ensure all new tests pass.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Worker prompt

Your task is to add unit tests for the functions defined in `src/lib/firestore.ts`.

1.  **Create a new test file**: Create `src/__tests__/firestore.test.ts`.
2.  **Implement Unit Tests**:
    *   Identify the main helper functions in `src/lib/firestore.ts` responsible for interacting with Firestore (e.g., functions for adding, updating, deleting, or fetching `nailItems`).
    *   Write unit tests for these functions.
    *   Use Vitest's mocking capabilities (`vi.mock`) to mock Firebase SDK imports (e.g., `firebase/firestore`) to ensure tests are isolated and do not require an active Firebase project connection.
    *   Focus on verifying the correct Firestore methods are called with the expected arguments and that the functions handle successful operations and potential errors gracefully.
    *   Ensure a reasonable level of test coverage for the core logic in `src/lib/firestore.ts`.
3.  **Run Tests and Linters**:
    *   Execute `npm run test` to verify your new tests pass.
    *   Execute `npm run build && npm run lint` to ensure no build or linting errors are introduced.

**Example functions to target (if they exist in `src/lib/firestore.ts`):**
*   `addNailItem(userId, itemData)`
*   `updateNailItem(userId, itemId, updatedData)`
*   `deleteNailItem(userId, itemId)`
*   `getNailItems(userId)`
*   `subscribeToNailItems(userId, callback)`

### Summary of what changed
[Jules will fill this out]

### Changed files list
[Jules will fill this out]

### Commands run and results
[Jules will fill this out]

### Known issues or limitations
[Jules will fill this out]

### Suggested next task
[Jules will fill this out]
```
