# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses the "Test coverage" aspect (2.1). The application uses Firebase Firestore for data storage. The goal is to begin adding unit tests for the existing helper functions that interact with Firestore.

## Objective

Add Vitest unit tests for the helper functions in `src/lib/firestore.ts`.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/firestore.ts` (minor modifications for testability if strictly necessary, but prefer to add tests without altering implementation)
- `src/__tests__/lib/firestore.test.ts` (new file)
- `vite.config.ts` (for Vitest configuration if necessary, e.g., mocking setup)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` (not relevant for this task)
- Any other `src/lib/` files besides `firestore.ts` for implementation or `auth.ts`, `storage.ts`, `publicShares.ts` for *potential* mocking in `firestore.test.ts`.

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm test` before finishing.
- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Use Vitest's mocking capabilities (`vi.mock`) to mock the Firebase Firestore SDK, ensuring tests are isolated and do not make actual network calls.
- Focus on testing the core CRUD helper functions within `src/lib/firestore.ts`, such as `getNailItems`, `addNailItem`, `updateNailItem`, and `deleteNailItem`.
- Verify that these functions correctly interact with the *mocked* Firestore client methods (e.g., `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`) with the expected arguments.
- Do not attempt to test the Firebase SDK itself, only the logic within `src/lib/firestore.ts`.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
