```markdown
# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. The first sub-phase (2.1) is dedicated to increasing test coverage, specifically targeting helper functions. This task focuses on adding unit tests for Firestore helper functions.

## Objective

Implement Vitest unit tests for the `getNailItems` function located in `src/lib/firestore.ts`. This involves creating a new test file and mocking the Firebase SDK as needed for `firestore` interactions.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing, if necessary)
- `src/__tests__/firestore.test.ts` (new test file)
- `package.json` (only if adding a `test` script or similar, but no new npm dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files outside `src/` except for `.vitest` config files if strictly necessary and minimal.

## Requirements

- Create a new test file `src/__tests__/firestore.test.ts`.
- Add unit tests specifically for the `getNailItems` function, ensuring it correctly fetches and processes data from Firestore.
- Use Vitest's mocking capabilities (`vi.mock`) to mock Firebase SDK dependencies (e.g., `firebase/firestore`).
- Ensure the tests are isolated and do not interact with actual Firebase services.
- Keep the overall diff size to ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Report any necessary follow-up items or limitations as comments in the PR description.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
**Acceptance Criteria:**
- A new file `src/__tests__/firestore.test.ts` exists.
- The `getNailItems` function in `src/lib/firestore.ts` is covered by unit tests.
- Firebase Firestore interactions are properly mocked in tests.
- All tests pass when running `npm run test`.

**Required Test Commands:**
```bash
npm install # Ensure all dependencies are up to date
npm run build
npm run lint
npm run test
```
```
```
