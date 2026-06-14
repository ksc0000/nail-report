```markdown
# Worker Prompt Template

## Context

The product roadmap for `nail-report` is actively in Phase 2, which focuses on improving stability, test coverage, and UX. The first item under test coverage is to add unit tests for Firebase helper functions. This task specifically addresses test coverage for Firestore helper functions.

## Objective

Implement Vitest unit tests for the `addNailItem` helper function located in `src/lib/firestore.ts`. This will involve setting up mocks for Firebase Firestore SDK methods as necessary to test the function in isolation.

## Allowed Scope

- `src/lib/firestore.ts` (read-only for understanding the function)
- `src/__tests__/lib/firestore.test.ts` (create this new file for tests)
- `vitest.config.ts` (if minor configuration is needed for Firebase mocking)
- `package.json` (only to add `vitest` script if not already present, no new dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval, except if vitest itself needs a new dev dependency for mocking, which requires specific mention as a follow-up)
- Firebase deploy commands
- Secrets and credentials
- Modifying any functions in `src/lib/firestore.ts` other than inspecting them.

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Use Vitest for testing.
- Mock Firebase Firestore SDK functions (e.g., `addDoc`, `collection`) to isolate the `addNailItem` function for testing.
- Write at least one test case for `addNailItem` to ensure it correctly calls Firebase APIs with the expected arguments.
- Run `npm run build && npm run lint` before finishing.
- Run `npm run test` (or `vitest`) to confirm tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
