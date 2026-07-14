```markdown
# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically targets enhancing test coverage for core Firebase interactions. The current state indicates that Vitest has been chosen as the test runner and Firebase mocking is planned.

## Objective

Add Vitest unit tests for a few key helper functions within `src/lib/firestore.ts`, specifically focusing on `getNailItems` and `addNailItem`, using appropriate Firebase SDK mocking.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes to facilitate testing, if necessary)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/lib/` (read-only for understanding context)
- `package.json` (read-only, no dependency changes)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Implement unit tests for at least the `getNailItems` and `addNailItem` functions from `src/lib/firestore.ts`.
- Ensure Firebase SDK calls within the tested functions are properly mocked using Vitest's `vi.mock` to avoid actual Firebase interactions.
- Assert that functions behave as expected (e.g., return correct data, handle errors gracefully if applicable).
- Run `npm run build && npm run lint && npm run test` before finishing. All commands must pass.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
