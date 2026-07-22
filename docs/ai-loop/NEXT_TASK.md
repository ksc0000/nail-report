# Worker Prompt Template

## Context

The project is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses the "Test coverage" goal by adding unit tests to a critical Firebase utility file.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, ensuring correct interaction with the (mocked) Firebase Firestore SDK.

## Allowed Scope

- `src/lib/firestore.ts` (minimal modifications to helper functions if required for testability, e.g., exports)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (only if Vitest configuration for `src/lib` files is missing or incorrect)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Add unit tests for at least two key functions within `src/lib/firestore.ts` that interact with Firestore.
- Mock the Firebase Firestore SDK (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`, `getDocs`, `onSnapshot`) to ensure tests are isolated and do not require a live Firebase connection.
- Verify that the functions correctly call the mocked Firebase methods with the expected arguments.
- Keep the overall diff for the PR to ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing to ensure code quality and prevent build issues.
- Report any follow-up items as comments in the PR, rather than implementing additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
