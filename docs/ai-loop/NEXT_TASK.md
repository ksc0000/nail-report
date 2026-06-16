# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. A key initial step is to enhance test coverage for core utility functions. This task specifically targets the Firestore helper functions which are crucial for data persistence.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, with a focus on mocking Firebase SDK interactions.

## Allowed Scope

- `src/lib/firestore.ts` (modifications only if necessary for testability, but primarily focused on testing it)
- `src/__tests__/firestore.test.ts` (new file)
- `src/__tests__/setup.ts` (if global Vitest setup for Firebase mocking is beneficial, otherwise mock locally)
- `vitest.config.ts` (if minor configuration is needed for test setup/mocks)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files outside `src/` except `vitest.config.ts` if strictly necessary.

## Requirements

- Create a new test file, `src/__tests__/firestore.test.ts`.
- Use Vitest's `vi.mock` to mock Firebase Firestore SDK functions (`getFirestore`, `collection`, `doc`, `getDocs`, `getDoc`, `addDoc`, `updateDoc`, `deleteDoc`).
- Write unit tests for at least 3-4 key helper functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Ensure the tests verify correct data interaction and error handling where applicable, based on mocked Firebase responses.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
