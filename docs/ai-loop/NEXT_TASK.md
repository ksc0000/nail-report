```markdown
# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, focusing on improving stability, test coverage, and UX. The current state indicates that Vitest setup is part of Phase 2.1, implying it should be ready for use. This task focuses on implementing the first set of unit tests for core helper functions.

## Objective

Implement unit tests for the helper functions in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (for potential minor refactoring to improve testability, but minimal changes expected)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/__tests__/utils.ts` (new file for Firebase mocking utilities, if necessary)
- `vite.config.ts` (if minor Vitest configuration adjustments are needed for testing specific modules, but prefer not to touch)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` (not relevant for this task)

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies as needed to isolate `firestore.ts` logic.
- Cover key helper functions in `src/lib/firestore.ts` with unit tests (e.g., `addNailItem`, `updateNailItem`, `deleteNailItem`, `getNailItems`, `getNailItem`, `addPublicShare`, `deletePublicShare`, `getPublicShare`). Aim for at least 3-5 functions.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
