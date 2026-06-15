# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. A key objective for this phase is to add unit tests for Firebase helper functions. Vitest is the chosen test runner, and mocking Firebase SDK is required.

## Objective

Add unit tests for helper functions located in `src/lib/firestore.ts` using Vitest. Focus on mocking Firebase SDK calls as necessary to ensure tests are isolated and fast.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prefer minimal changes)
- `src/__tests__/firestore.test.ts` (new test file)
- `vite.config.ts` (minor configuration for Vitest if absolutely necessary, but assume Vitest is already configured)
- `package.json` (only to add `test` script if missing, no new dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two helper functions in `src/lib/firestore.ts`.
- Mock Firebase Firestore SDK interactions using `vi.mock` to ensure tests are independent of actual Firebase calls.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
**Suggested next task for the AI Loop:** Add loading skeleton to nail item list (`src/App.tsx`)
