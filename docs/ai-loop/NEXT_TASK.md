# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, focusing on improving stability, test coverage, and UX. The current state indicates that initial AI-Loop setup is complete, and a generic "First substantive task pending" is in progress. The next logical step is to address test coverage as specified in Phase 2.1.

## Objective

Add unit tests using Vitest for the helper functions within `src/lib/firestore.ts`. This involves mocking Firebase SDK interactions to test the logic of these helper functions in isolation.

## Allowed Scope

- `src/lib/firestore.ts` (for minor refactors to improve testability, if necessary)
- `src/__tests__/firestore.test.ts` (new test file)
- `vitest.config.ts` (if minor configuration is needed for Firebase mocking)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` (CSS improvements)
- Any files not directly related to `src/lib/firestore.ts` testing.

## Requirements

- Create a new test file `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two helper functions in `src/lib/firestore.ts` that involve Firestore interactions (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Use Vitest and `vi.mock` to mock Firebase SDK methods (e.g., `getFirestore`, `collection`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`).
- Ensure tests assert the correct data is passed to mocked Firebase functions and that functions handle success/failure scenarios appropriately.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm test` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
