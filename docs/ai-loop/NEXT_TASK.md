# Worker Prompt Template

## Context

The AI Loop is progressing through Phase 2 of the roadmap, focusing on improving stability, test coverage, and UX. The current task is to begin implementing unit tests for the core helper functions.

## Objective

Implement unit tests for the helper functions in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability if strictly necessary, but focus on testing existing logic)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `src/__tests__/utils/` (new files for Firebase mock setup if needed)
- `src/` (general additions for test setup, e.g., mock files)

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
- Focus on testing the core CRUD operations (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`) and any data serialization/deserialization logic within `src/lib/firestore.ts`.
- Mock Firebase SDK calls (Firestore and Auth) using `vitest` and `vi.mock` to ensure tests are isolated and do not interact with actual Firebase services.
- Ensure tests cover both successful operations and potential error scenarios (e.g., `addDoc` rejection).
- Run `npm test` successfully.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
