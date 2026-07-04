```markdown
# Worker Prompt Template

## Context

The product roadmap indicates that Phase 2.1 is focused on improving test coverage, specifically starting with unit tests for Firestore helper functions using Vitest. The current state shows "First substantive task pending". This task is a direct implementation of that roadmap item.

## Objective

Implement unit tests for helper functions within `src/lib/firestore.ts`, leveraging Vitest as the test runner.

## Allowed Scope

- `src/lib/firestore.ts` (for understanding and referencing existing functions)
- `src/__tests__/` (for creating new test files, e.g., `src/__tests__/firestore.test.ts`)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (do not add new npm packages, Vitest is assumed to be installed and configured as per roadmap)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create at least one new test file, for example, `src/__tests__/firestore.test.ts`.
- Write unit tests for some of the key helper functions exported from `src/lib/firestore.ts`. Focus on functions that interact directly with Firestore (e.g., `addNailItem`, `getNailItems`, `updateNailItem`).
- Ensure Firebase SDK dependencies (Firestore instances, collection/doc references) are mocked appropriately to achieve isolated unit testing.
- Tests should cover both successful operations and relevant error paths, where applicable and feasible within the line limit.
- Run `npm run build && npm run lint` before finishing.
- Run tests (`npm test` or `vitest`) and ensure they pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
