# Worker Prompt Template

## Context

The current phase of development focuses on improving stability, test coverage, and UX. This task specifically targets increasing test coverage for core utility functions.

## Objective

Implement unit tests for selected helper functions within `src/lib/firestore.ts` using Vitest. Focus on covering at least two key functions, such as `getNailItems` and `addNailItem`, demonstrating mocking of Firebase Firestore SDK calls.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications to facilitate testing, e.g., exporting unexported functions, but no functional changes)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `package.json` (only if a `test` script is missing or needs minor adjustment to run Vitest; no new dependencies)
- `src/App.css` (N/A for this task)

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
- Mock Firebase Firestore SDK methods (e.g., `getDoc`, `setDoc`, `collection`, `query`) as needed using `vi.mock`.
- Ensure tests cover successful scenarios and error handling for the chosen functions.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
