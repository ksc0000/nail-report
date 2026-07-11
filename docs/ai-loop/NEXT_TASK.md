# Worker Prompt Template

## Context

The nail-report application is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses Phase 2.1: Test coverage. The goal is to enhance the reliability of our data handling by adding unit tests for core Firebase Firestore helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. Focus on covering at least two to three essential CRUD-related functions (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability, e.g., exporting functions)
- `src/__tests__/lib/firestore.test.ts` (new file for unit tests)
- `package.json` (only if a `test` script needs to be added or modified to run Vitest, strictly no new dependencies)
- `vite.config.ts` (only for minimal Vitest configuration if absolutely necessary and not already present)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` or other UI-related files

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Ensure the tests adequately cover at least two to three core helper functions in `src/lib/firestore.ts`.
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`, `firebase/auth`) using `vi.mock` as appropriate to isolate the logic being tested.
- Write clear and descriptive test names.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
