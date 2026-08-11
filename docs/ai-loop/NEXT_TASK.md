# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses Phase 2.1, enhancing test coverage. Vitest is the designated test runner, and the goal is to add unit tests for Firebase helper functions.

## Objective

Implement unit tests for `src/lib/firestore.ts` helper functions, specifically focusing on `addNailItem` and `getNailItems`.

## Allowed Scope

- `src/lib/firestore.ts` (for inspecting functions to be tested)
- `src/__tests__/firestore.test.ts` (new file for unit tests)
- `src/__tests__/utils/mockFirebase.ts` (new file for Firebase mocking helpers, if deemed necessary to keep `firestore.test.ts` clean)
- `vite.config.ts` (for Vitest configuration related to Firebase SDK mocking, if required, e.g., aliasing or globals)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` `dependencies` or `devDependencies` (no new npm packages; `vitest` is assumed to be already installed and configured for basic use)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Use `vitest` for testing and `vi.mock` for mocking Firebase SDK components (e.g., `firebase/firestore`).
- Write unit tests for at least the `addNailItem` and `getNailItems` functions found in `src/lib/firestore.ts`.
- Ensure tests verify correct interaction with the mocked Firebase SDK (e.g., `addDoc` or `getDocs` are called with correct arguments and return expected values).
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
