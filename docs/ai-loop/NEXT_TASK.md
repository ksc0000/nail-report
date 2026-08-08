```markdown
# Worker Prompt Template

## Context

The application is in Phase 2, focusing on improving stability, test coverage, and user experience. This task specifically addresses the need for increased test coverage for core utility functions related to Firebase Firestore operations.

## Objective

Implement comprehensive unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest. Mock Firebase SDK calls to ensure tests are isolated and focus solely on the logic within `firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications, e.g., exporting functions for testing, should be kept to a minimum)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (only if absolutely necessary for mocking configuration, otherwise avoid)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file: `src/__tests__/firestore.test.ts`.
- Write unit tests for all relevant functions exported from `src/lib/firestore.ts`, such as `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, etc.
- Utilize Vitest's mocking capabilities (`vi.mock`) to mock Firebase SDK methods (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`).
- Ensure tests verify both successful operations and error handling paths.
- Keep the diff ≤ 150 lines.
- Run `npm run test` and `npm run build && npm run lint` before finishing to ensure all checks pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
