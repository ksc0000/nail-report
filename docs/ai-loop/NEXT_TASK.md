```markdown
# Worker Prompt Template

## Context

The current phase is 2.0, focusing on improving stability, test coverage, and UX. The first priority in Phase 2 is "2.1 Test coverage". This task focuses on adding foundational unit tests for core Firebase interactions.

## Objective

Implement unit tests for one or two helper functions within `src/lib/firestore.ts` using Vitest. Specifically, add tests for `createNailItem` and/or `getNailItems` to ensure their functionality with mocked Firebase SDK.

## Allowed Scope

- `src/lib/firestore.ts` (for minor adjustments to enable testing, if necessary)
- `src/__tests__/firestore.test.ts` (new file for unit tests)
- `vitest.config.ts` (for necessary Vitest setup, if not already configured for mocks)
- `package.json` (for adding a Vitest script if not already present, but *not* new dependencies)

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
- Use Vitest's mocking capabilities (`vi.mock`) to mock Firebase SDK dependencies (e.g., `firebase/firestore`, `firebase/auth`) to isolate the logic in `firestore.ts`.
- Focus on testing the success paths and basic error handling for `createNailItem` and/or `getNailItems`.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
