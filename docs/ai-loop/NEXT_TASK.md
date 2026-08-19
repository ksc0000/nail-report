# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. The first sub-goal in this phase is to increase test coverage, specifically starting with unit tests for Firebase helper functions.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, or minor refactoring for testability)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (if minor configuration is needed for mocking, though ideally not)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies as needed using `vi.mock` to ensure true unit tests.
- Cover key helper functions in `src/lib/firestore.ts` such as those for creating, reading, updating, and deleting nail items, and handling public shares. Prioritize functions that interact directly with Firestore collections (e.g., `nailItems`, `publicShares`).
- Focus on testing the logic of the helper functions, not the Firebase SDK itself.
- Ensure tests pass with `npm run test`.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
