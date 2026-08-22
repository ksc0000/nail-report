```markdown
# Worker Prompt Template

## Context

The product roadmap for `nail-report` is currently in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates work on Phase 2.1, which targets adding comprehensive test coverage to the application's core logic. The current state indicates that no substantive tasks have been completed yet.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest. The goal is to ensure the reliability of Firestore interactions by testing CRUD operations and data serialization/deserialization.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally minimal changes to production code)
- `src/__tests__/` (create `src/__tests__/firestore.test.ts` and potentially mock files within `src/__tests__/mocks/`)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file: `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two key helper functions within `src/lib/firestore.ts` that interact with Firestore (e.g., `getNailItem`, `createNailItem`, `updateNailItem`, `deleteNailItem`, or similar CRUD operations).
- Mock the Firebase SDK (Firestore specifically) using Vitest's `vi.mock` to ensure tests are isolated and do not make actual network requests.
- Ensure the tests cover successful operations and, if applicable and straightforward, basic error handling (e.g., item not found).
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Ensure all new test files conform to existing project linting rules.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
