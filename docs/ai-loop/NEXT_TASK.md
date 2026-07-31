# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, which focuses on improving stability, test coverage, and UX. This task specifically addresses Phase 2.1, "Test coverage," by adding unit tests for core helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. Focus on covering basic CRUD operations for nail items.

## Allowed Scope

- `src/lib/firestore.ts` (for potential minor adjustments if needed for testing, but primarily for understanding logic)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (for Vitest configuration setup if not already present)
- `package.json` (for adding `vitest` scripts, but NO new `dependencies` or `devDependencies` should be added beyond what's strictly necessary for Vitest itself if not already there, and only if `vitest` is not already a devDependency)
- `tsconfig.json` (for Vitest types if needed)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no *new* npm packages beyond Vitest if not already present, and no new *feature* dependencies without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Add a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies as needed using `vi.mock`.
- Cover at least the `createNailItem`, `getNailItem`, `updateNailItem`, and `deleteNailItem` functions in `src/lib/firestore.ts`.
- Run `npm run test` (or `npm test` if configured) to ensure tests pass.
- Run `npm run build && npm run lint` before finishing.
- Ensure no new npm `dependencies` are added; `devDependencies` for Vitest are allowed if not already present.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
