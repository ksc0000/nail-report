```markdown
# Worker Prompt Template

## Context

The current phase is 2.0, focusing on improving stability, test coverage, and UX. This task will contribute to Phase 2.1 (Test coverage) by adding unit tests for core Firebase Firestore helper functions. Vitest is specified as the test runner in the roadmap and is assumed to be already installed.

## Objective

Implement unit tests for helper functions in `src/lib/firestore.ts` using Vitest, specifically focusing on basic CRUD operations.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prefer not to alter production code heavily for tests)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (minimal configuration for Vitest if absolutely necessary, but prioritize existing setup)

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

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

1.  **Create a new test file:** In the `src/__tests__/` directory, create `firestore.test.ts`.
2.  **Mock Firebase SDK:** Use `vi.mock('firebase/firestore')` to mock Firebase SDK functions (e.g., `getDoc`, `setDoc`, `addDoc`, `deleteDoc`, `updateDoc`, `collection`, `doc`, `query`, `where`, etc.) to enable isolated testing of `src/lib/firestore.ts` functions.
3.  **Write Unit Tests:**
    *   Focus on the core CRUD operations for `nailItems` within `src/lib/firestore.ts`.
    *   Implement tests for functions such as `addNailItem`, `updateNailItem`, and `deleteNailItem`. You can start with `addNailItem` to ensure the mocking setup is correct.
    *   Ensure tests cover successful execution paths. Basic error scenarios (e.g., if a mocked Firebase call throws an error) can be added if it's straightforward without significantly increasing complexity or line count.
    *   Verify that the helper functions correctly interact with the mocked Firebase SDK (e.g., `addDoc` is called with the expected arguments).
4.  **No New Dependencies:** Do not add any new npm packages to `package.json`. Vitest is assumed to be pre-configured.
5.  **Run Tests:** Execute `npm run test` to ensure the new tests pass.

This task aims to lay the groundwork for comprehensive test coverage by starting with critical Firestore interactions.

```
