# Worker Prompt Template

## Context

The application is in Phase 2, focusing on improving stability, test coverage, and UX. The current task is to begin adding unit test coverage to core helper functions. Vitest has been selected as the test runner, and mocking Firebase SDK is expected.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts`. This task focuses specifically on functions related to Firestore operations, such as creating, reading, updating, and deleting nail items or managing public shares, ensuring they handle data correctly and interact with Firestore as expected, using mocked Firebase SDK methods.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability, e.g., exporting non-exported functions if necessary)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only to add or modify test scripts/configuration, NOT to add new npm dependencies)
- `vite.config.ts` (for Vitest configuration if needed)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` `dependencies` or `devDependencies` (do not add new npm packages; Vitest should already be configured as per roadmap)
- Firebase deploy commands
- Secrets and credentials
- Any other files or directories not explicitly mentioned in "Allowed Scope".

## Requirements

- **Test Coverage**: Write unit tests for at least 2-3 key functions within `src/lib/firestore.ts`. Focus on functions that interact directly with Firestore collections (e.g., `nailItems`, `publicShares`).
- **Mocking**: Use `vi.mock` to mock Firebase SDK functionality as required for isolating the functions under test.
- **Assertions**: Use Vitest's assertion library to verify function behavior, including correct data manipulation and Firestore method calls.
- **Code Style**: Adhere to existing code style.
- **Diff Size**: Keep the overall diff for this task at or below 150 lines.
- **Pre-commit Checks**: Run `npm run build && npm run lint` successfully before considering the task complete.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
**Acceptance Criteria**:
1. A new test file `src/__tests__/firestore.test.ts` is created.
2. At least 2-3 functions from `src/lib/firestore.ts` have corresponding unit tests.
3. Firebase SDK interactions are mocked using `vi.mock`.
4. Tests pass successfully when `npm run test` is executed.

**Required Test Commands**:
```bash
npm install # Ensure all dependencies are up to date
npm run build
npm run lint
npm run test
```
