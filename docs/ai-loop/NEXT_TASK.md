```markdown
# Worker Prompt Template

## Context

The product roadmap indicates that Phase 2 is active, focusing on improving stability, test coverage, and UX. This task targets the "Test coverage" aspect, specifically adding unit tests for Firebase helper functions. Vitest has been selected as the test runner.

## Objective

Implement unit tests for core helper functions within `src/lib/firestore.ts` using the existing Vitest setup. Specifically, focus on adding tests for functions related to adding and retrieving nail items (e.g., `addNailItem` and `getNailItem`, or similar primary CRUD operations depending on the actual API of `firestore.ts`). This will involve mocking the Firebase Firestore SDK to ensure tests run in isolation.

## Allowed Scope

- `src/lib/firestore.ts` (for inspection of functions to test)
- `src/__tests__/firestore.test.ts` (new test file)
- `package.json` (only to add or modify test scripts, *not* to add new `dependencies` or `devDependencies` without explicit approval – Vitest is assumed to be an existing devDependency)
- `vitest.config.ts` (if minor configuration is needed for mock setup, though unlikely for a first task)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` (adding new npm packages as `dependencies` or `devDependencies` is forbidden, unless Vitest itself needs to be added and is approved by a human first. Assume Vitest is already present.)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two primary functions in `src/lib/firestore.ts` (e.g., `addNailItem` and `getNailItem`).
- Ensure the Firebase Firestore SDK is mocked using `vi.mock` to prevent actual network calls during tests.
- All new tests must pass.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
