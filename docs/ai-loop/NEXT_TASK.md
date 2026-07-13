# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task specifically addresses Phase 2.1: Test coverage. The goal is to begin adding unit tests for core helper functions.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications only if necessary for testability, minor refactors)
- `src/__tests__/firestore.test.ts` (new file)
- `vite.config.ts` (if needed for Vitest setup, but ideally Vitest is already configured)

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
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

### Acceptance Criteria

- A new test file `src/__tests__/firestore.test.ts` must be created.
- The new tests must cover at least the primary CRUD-related helper functions within `src/lib/firestore.ts` that interact with the `nailItems` and `publicShares` collections. Examples include `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, and related public share functions.
- Firebase SDK functions (e.g., `getFirestore`, `collection`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`, `doc`) must be properly mocked using `vitest.mock` to ensure tests are isolated and do not interact with a live Firebase project.
- All new tests must pass when `npm run test` is executed.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
