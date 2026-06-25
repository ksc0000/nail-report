# Worker Prompt Template

## Context

The product roadmap for nail-report is currently in Phase 2, focusing on improving stability, test coverage, and UX. Specifically, Phase 2.1 emphasizes adding unit tests for helper functions. This task directly addresses that goal by targeting the Firestore utility functions.

## Objective

Implement unit tests for one or more helper functions within `src/lib/firestore.ts` using Vitest, ensuring proper mocking of Firebase SDK dependencies.

## Allowed Scope

- `src/lib/firestore.ts` (for minor adjustments to make functions testable if necessary, but primarily for the functions themselves)
- `src/__tests__/` (for creating new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (for test configuration if strictly necessary, but prefer existing setup)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file, `src/__tests__/firestore.test.ts`.
- Add unit tests for at least two simple helper functions from `src/lib/firestore.ts` (e.g., `getNailItemRef`, `getAllTagsRef`).
- Use `vitest` and mock Firebase SDK functionalities (e.g., `getFirestore`, `collection`, `doc`) as needed to isolate the functions under test.
- Ensure the tests are self-contained and do not interact with a live Firebase instance.
- Keep the diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
