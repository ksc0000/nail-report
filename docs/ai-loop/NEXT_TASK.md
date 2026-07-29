```markdown
# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task specifically addresses Phase 2.1: Test coverage, by adding unit tests for core helper functions. Vitest is already configured as the test runner.

## Objective

Implement Vitest unit tests for the helper functions in `src/lib/firestore.ts`. The tests should cover basic CRUD operations (e.g., adding, getting, updating, deleting nail items) and ensure proper interaction with the Firestore SDK, using `vi.mock` where necessary to mock Firebase services.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments to functions to facilitate testing, if absolutely necessary, but prioritize testing existing API)
- `src/__tests__/firestore.test.ts` (new file for unit tests)
- `src/utils/test-utils.ts` (or similar new file for common test utilities/mocks, if needed)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval; Vitest is already installed)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` (no CSS changes for this task)

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Mock Firebase Firestore SDK calls using `vi.mock` to isolate `firestore.ts` logic.
- Cover at least three core functions (e.g., add, get, delete) with basic unit tests.
- Ensure tests run successfully using `npm test`.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
