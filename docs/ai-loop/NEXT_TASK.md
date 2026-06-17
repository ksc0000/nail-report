```markdown
# Worker Prompt Template

## Context

The product roadmap focuses on improving stability, test coverage, and UX in Phase 2. The current state indicates that test coverage is a priority.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`. This task aims to improve the test coverage of critical data access logic.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes for testability, e.g., exporting unexported helpers)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (if Vitest configuration needs adjustment, though it should be set up based on roadmap)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two helper functions or main functions in `src/lib/firestore.ts` that interact with Firestore. Examples might include functions for adding, updating, or fetching data.
- Mock Firebase SDK dependencies as needed using `vitest` and `vi.mock`.
- Ensure tests run successfully and provide meaningful coverage.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Acceptance Criteria

- A new test file `src/__tests__/firestore.test.ts` is created.
- The new test file contains unit tests for at least two functions from `src/lib/firestore.ts`.
- Firebase dependencies are correctly mocked using `vitest` mocks.
- `npm test` runs successfully, and the new tests pass.
- The `firestore.ts` file remains functional and compatible with the rest of the application.

## Required Test Commands

```bash
npm install # Ensure all dependencies are present
npm run test # Run Vitest unit tests
npm run build
npm run lint
```
```
