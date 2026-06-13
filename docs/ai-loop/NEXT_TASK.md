# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task. Phase 2 is active, focusing on stability, test coverage, and UX. This task contributes to test coverage by adding unit tests for core Firebase helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, ensuring proper mocking of the Firebase SDK.

## Allowed Scope

- `src/lib/firestore.ts` (modifications only if necessary for testability, minor refactors are okay)
- `src/__tests__/firestore.test.ts` (new file)
- `vitest.config.ts` (minor configuration changes if absolutely necessary for Firebase mocking)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` or other CSS files

## Requirements

- Create a new test file: `src/__tests__/firestore.test.ts`.
- Add unit tests for the functions exported from `src/lib/firestore.ts`.
- Mock the Firebase SDK (Firestore specifically) using `vi.mock` to isolate the functions under test.
- Ensure test coverage for basic CRUD operations (add, get, update, delete) as applicable to the helpers in `firestore.ts`.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
