# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. The current state indicates that test coverage for `src/lib/` helper functions is a priority.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, focusing on core functionality and mocking Firebase SDK interactions.

## Allowed Scope

- `src/lib/firestore.ts` (for understanding the functions to be tested)
- `src/__tests__/firestore.test.ts` (or a similar new test file in `src/__tests__/`)
- `src/vitest.setup.ts` (if minor setup is needed for Firebase mocking, though `vi.mock` in test files is preferred)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files outside `src/` except for the specified test files.

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Write unit tests for at least 2-3 key helper functions in `src/lib/firestore.ts` that interact with Firestore (e.g., functions for adding, getting, updating, or deleting `nailItems`).
- Ensure Firebase SDK calls (e.g., `addDoc`, `getDoc`, `updateDoc`, `deleteDoc`, `collection`, `doc`) are properly mocked using `vi.mock` to isolate the unit tests from actual Firebase interactions.
- Do not modify the production code in `src/lib/firestore.ts` unless absolutely necessary to enable testing (e.g., exporting an unexported helper). Any such modifications must be minimal.
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` and ensure all new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
