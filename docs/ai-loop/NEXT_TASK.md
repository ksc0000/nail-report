```markdown
# Worker Prompt Template

## Context

The product roadmap for `nail-report` includes Phase 2, which focuses on improving stability, test coverage, and UX. This task directly addresses "2.1 Test coverage" by adding unit tests for core Firebase helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (for inspection, not modification if possible)
- `src/__tests__/` (for creating new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (only if Vitest configuration is absolutely necessary, but prioritize using existing setup)
- `package.json` (only to confirm Vitest scripts, no new dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Focus on testing key CRUD operations exposed by `src/lib/firestore.ts`, such as `createNailItem`, `updateNailItem`, and `deleteNailItem`.
- Mock Firebase SDK dependencies (Firestore instances, doc references, etc.) using `vi.mock` to ensure tests are isolated unit tests.
- Ensure `npm test` runs successfully and the new tests pass.
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
