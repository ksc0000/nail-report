```markdown
# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, which focuses on improving stability, test coverage, and UX. This task initiates the test coverage effort by adding unit tests for core helper functions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prioritize adding tests without changing core logic)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (only if absolutely necessary for Vitest configuration, but prioritize using existing setup)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines. Focus on testing 1-3 key helper functions from `src/lib/firestore.ts`.
- Use `vitest` for writing tests. Assume `vitest` is already configured and available.
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`, `firebase/auth`) using `vi.mock` as necessary to isolate the unit under test.
- Ensure tests cover basic functionality and relevant edge cases (e.g., successful calls, error conditions if applicable to the helper's logic).
- Run `npm run build && npm run lint` before finishing.
- Run `npm run test` (or `vitest`) to confirm tests pass.
- Report any necessary setup steps for Vitest (if it's not already runnable) as a follow-up item.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
