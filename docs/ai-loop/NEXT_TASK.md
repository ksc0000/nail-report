```markdown
# Worker Prompt Template

## Context

The AI Loop is currently in Phase 2 of the roadmap, focusing on improving stability, test coverage, and UX. This task initiates the process of adding unit tests to the application's core helper functions, specifically targeting Firebase Firestore interactions.

## Objective

Add Vitest unit tests for the helper functions located in `src/lib/firestore.ts`. This involves creating a new test file and mocking Firebase SDK dependencies as needed.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability if necessary)
- `src/__tests__/firestore.test.ts` (new test file)
- `vite.config.ts` (if Vitest setup for mocks is needed)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files or folders not explicitly listed in "Allowed Scope"

## Requirements

- Create a new test file: `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two functions within `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, etc.).
- Mock Firebase SDK dependencies (Firestore, DocumentReference, etc.) using `vitest` and `vi.mock` to ensure tests run in isolation without actual Firebase calls.
- Ensure test coverage is added for the tested functions.
- Keep the overall diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
