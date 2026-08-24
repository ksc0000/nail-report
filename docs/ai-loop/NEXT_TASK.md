```markdown
# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses Phase 2.1: "Test coverage", which includes "Unit tests for Firestore helper functions (`src/lib/firestore.ts`)" and using "Vitest" for testing.

## Objective

Implement unit tests for one or more data retrieval helper functions within `src/lib/firestore.ts`. This involves setting up Firebase Firestore SDK mocking using `vi.mock` and writing effective tests.

## Allowed Scope

- `src/lib/firestore.ts`
- `src/__tests__/firestore.test.ts` (new file)
- `vitest.config.ts` (for minimal configuration adjustments if absolutely necessary)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files or directories not explicitly listed in "Allowed Scope"

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Implement mocking for the Firebase Firestore SDK (e.g., `getDocs`, `query`, `collection`) using `vi.mock` to isolate `src/lib/firestore.ts` functions from actual Firebase calls during tests.
- Write unit tests for at least one data retrieval helper function in `src/lib/firestore.ts` (e.g., a function that fetches a list of nail items or a single item).
- Ensure tests cover typical success cases and basic error handling if present in the tested function.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
**Acceptance Criteria:**

- A new file `src/__tests__/firestore.test.ts` exists.
- This file contains tests for at least one function in `src/lib/firestore.ts` that retrieves data from Firestore.
- Firebase Firestore SDK calls are mocked using `vi.mock`.
- The tests run successfully using Vitest.

**Required Test Commands:**

```bash
npm test
npm run build
npm run lint
```
```
