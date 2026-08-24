```markdown
# Worker Prompt Template

## Context

The application is in Phase 2, focusing on improving stability and test coverage. A key step is to add unit tests for the core utility functions. This task specifically targets the Firebase Firestore helper functions to ensure their reliability and ease future refactoring.

## Objective

Implement comprehensive unit tests for the helper functions defined in `src/lib/firestore.ts` using Vitest. This involves creating a new test file and effectively mocking the Firebase Firestore SDK to ensure tests are isolated and do not interact with actual Firebase services.

## Allowed Scope

- `src/lib/firestore.ts` (Minor modifications if necessary to facilitate testing, such as exporting internal functions, but prioritize minimal changes to the original file.)
- `src/__tests__/firestore.test.ts` (New file for unit tests)
- `vite.config.ts` (If minor Vitest configuration adjustments are needed, but avoid adding new dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages; Vitest should already be configured as per roadmap)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file: `src/__tests__/firestore.test.ts`.
- Use Vitest for writing tests.
- **Mock the Firebase Firestore SDK**: Ensure all interactions with Firebase (e.g., `doc`, `collection`, `getDoc`, `setDoc`, `updateDoc`, `deleteDoc`, `query`, `getDocs`) are properly mocked to prevent actual database calls.
- Write at least 2-3 unit tests covering common scenarios (e.g., adding a document, retrieving a document, updating a document, deleting a document, or querying a collection) for the helper functions in `src/lib/firestore.ts`.
- The tests should verify the logic of the helper functions, not the Firebase SDK itself.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing and ensure all pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
