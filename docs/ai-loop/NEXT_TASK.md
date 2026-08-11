```markdown
# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, focusing on improving stability, test coverage, and UX. Specifically, Phase 2.1 targets adding unit tests for Firebase helper functions. This task directly addresses the goal of increasing test coverage for core application logic.

## Objective

Implement unit tests for selected helper functions within `src/lib/firestore.ts` using Vitest, ensuring proper mocking of the Firebase SDK.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally only the file itself is read and a new test file is created)
- `src/__tests__/firestore.test.ts` (new test file)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file: `src/__tests__/firestore.test.ts`.
- Add unit tests for *at least two* helper functions in `src/lib/firestore.ts`. Good candidates include `addNailItem`, `getNailItems`, or `deleteNailItem`.
- Ensure the Firebase SDK (e.g., `firebase/firestore` methods) is properly mocked using `vi.mock` to isolate the unit tests from actual Firebase calls.
- Write clear, concise tests covering basic functionality and edge cases where appropriate.
- Keep the diff for the entire PR to ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Report any follow-up items or functions not tested as comments in the PR description, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
