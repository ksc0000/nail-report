```markdown
# Worker Prompt Template

## Context

The current phase focuses on improving stability and test coverage. The `src/lib/firestore.ts` file contains critical helper functions for interacting with Firebase Firestore. Adding unit tests for these functions will enhance code quality and prevent regressions.

## Objective

Implement unit tests for key helper functions within `src/lib/firestore.ts` using the existing Vitest test runner. Focus on covering basic CRUD operations for `nailItems`.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability, if necessary)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `src/__mocks__/firebase-firestore.ts` (if creating specific mocks for Firestore)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` (do not add new npm packages/dependencies without human approval; assume Vitest is already configured as a dev dependency)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, `src/__tests__/lib/firestore.test.ts`.
- Write unit tests for at least `createNailItem`, `updateNailItem`, `deleteNailItem`, and `getNailItems` from `src/lib/firestore.ts`.
- Use `vi.mock` to mock Firebase Firestore SDK interactions (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`, `getDocs`, `onSnapshot`).
- Ensure all tests are isolated and do not interact with actual Firebase services.
- Run `npm run build && npm run lint` before finishing.
- Report any issues with the existing Vitest setup or the inability to proceed without adding new npm packages as a limitation.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Acceptance Criteria

- A new test file `src/__tests__/lib/firestore.test.ts` is created.
- The new test file contains passing unit tests for `createNailItem`, `updateNailItem`, `deleteNailItem`, and `getNailItems`.
- Firebase Firestore interactions are properly mocked using `vi.mock`.
- All checks (`npm test`, `npm run build`, `npm run lint`) pass.

## Required Test Commands

```bash
npm test
npm run build
npm run lint
```

## Worker prompt

Implement unit tests for the `createNailItem`, `updateNailItem`, `deleteNailItem`, and `getNailItems` functions located in `src/lib/firestore.ts`. Create a new file `src/__tests__/lib/firestore.test.ts` for these tests. Use `vi.mock` to mock Firebase Firestore SDK methods to ensure tests are isolated and do not require a live Firebase connection. Do not add any new npm packages. If Vitest is not already set up as a `devDependency` or cannot be run, report this as a blocker.
```
