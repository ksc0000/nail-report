# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and user experience. The current state indicates that test coverage is a priority within this phase. This task focuses on establishing foundational unit tests for core Firebase operations.

## Objective

Implement unit tests for helper functions within `src/lib/firestore.ts` using Vitest, specifically targeting the CRUD operations for nail items.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to facilitate testing, if necessary, but primarily for understanding)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (if minor configuration is needed for mock setup)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files outside `src/` except for `vitest.config.ts` if strictly necessary.

## Requirements

- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Add unit tests for the core `nailItems` CRUD operations in `src/lib/firestore.ts`, such as `addNailItem`, `getNailItems`, `updateNailItem`, and `deleteNailItem`.
- Use `vitest` for the test runner and `vi.mock` to mock Firebase SDK dependencies (e.g., `firestore`, `doc`, `collection`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`).
- Ensure tests cover basic success cases and error handling for at least two of the primary CRUD functions (e.g., `addNailItem` and `getNailItems`).
- Keep the diff for the entire PR (including test file and any minor changes) to ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing to ensure code quality and no build errors.
- Prefer adding tests over refactoring existing production code extensively within this task.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
