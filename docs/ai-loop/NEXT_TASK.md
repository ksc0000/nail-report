# Worker Prompt Template

## Context

The current focus is on Phase 2.1 of the roadmap: improving test coverage. This task involves adding unit tests for our Firebase Firestore helper functions. Vitest is the chosen test runner, and Firebase SDK calls should be mocked.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (for reading existing functions to test)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (if Vitest setup is explicitly needed, but likely already configured for basic setup)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Add a new test file `src/__tests__/firestore.test.ts`.
- Implement unit tests for at least two functions within `src/lib/firestore.ts`. Focus on functions that interact with Firestore (e.g., adding, getting, or updating documents).
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`) using `vi.mock` as specified by Vitest documentation.
- Ensure tests run successfully using `npm test`.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
