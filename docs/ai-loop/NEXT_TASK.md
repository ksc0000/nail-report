```markdown
# Worker Prompt Template

## Context

The team is focusing on Phase 2 of the roadmap, with a specific emphasis on improving test coverage. This task is the first step in establishing unit tests for the core utility functions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally no logic changes)
- `src/__tests__/` (create new test files for `firestore.ts` helpers)
- `package.json` (add `vitest` scripts if not already present, but *no new npm dependencies* should be added, `vitest` should already be configured from previous setup tasks or assumed to be available).
- `vite.config.ts` (if Vitest configuration is required)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval — assume Vitest is already installed or can be used if it's a dev dependency that *already exists*)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Write unit tests for the core CRUD helper functions within `src/lib/firestore.ts`, such as `getNailItems`, `addNailItem`, `updateNailItem`, and `deleteNailItem`.
- Mock Firebase SDK dependencies using `vi.mock` to ensure tests are isolated and do not interact with actual Firebase services.
- Ensure the tests cover basic success and error scenarios for the tested functions.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
