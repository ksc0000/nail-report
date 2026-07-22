```markdown
# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task. The product roadmap is in Phase 2, focusing on stability, test coverage, and UX. This task contributes to improving test coverage for core utility functions.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`. The goal is to ensure the reliability and correctness of the Firestore interaction logic.

## Allowed Scope

- `src/lib/firestore.ts` (minor refactoring for testability is allowed, but the primary focus is testing)
- `src/__tests__/` (create a new test file, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (minor configuration for test setup if absolutely necessary, but assume Vitest is already installed and configured to run)
- `package.json` (only if absolutely necessary for test scripts or configuration, no new `dependencies` or `devDependencies`)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` `dependencies` or `devDependencies` (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files outside `src/` except for `vite.config.ts` or `package.json` for test-related configuration.

## Requirements

- Keep diff ≤ 150 lines.
- Write unit tests for at least two significant helper functions within `src/lib/firestore.ts` (e.g., `addNailItem`, `updateNailItem`, `deleteNailItem`, `getNailItems`, or functions related to public shares).
- Mock Firebase SDK dependencies using `vitest` and `vi.mock` to isolate the Firestore logic from actual Firebase calls.
- Ensure tests run successfully using `npm test` (or `vitest`).
- Run `npm run build && npm run lint` before finishing to ensure code quality and prevent build issues.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
