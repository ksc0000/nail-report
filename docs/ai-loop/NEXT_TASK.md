# Worker Prompt Template

## Context

The application is in Phase 2 of the roadmap, focusing on improving stability, test coverage, and UX. This task specifically addresses "2.1 Test coverage" by adding unit tests for core Firebase helper functions.

## Objective

Implement unit tests for helper functions within `src/lib/firestore.ts` using Vitest. The focus should be on demonstrating correct mocking of the Firebase Firestore SDK and testing at least two common helper functions (e.g., adding an item and fetching items).

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability, if necessary)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/lib/firestore.test.ts`.
- Use `vi.mock` to mock the Firebase Firestore SDK (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc` as appropriate).
- Write at least two distinct unit tests for functions in `src/lib/firestore.ts`. Examples include `addNailItem`, `getNailItems`, `updateNailItem`, or `deleteNailItem`.
- Tests should assert correct interaction with the mocked Firestore functions and expected return values.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
