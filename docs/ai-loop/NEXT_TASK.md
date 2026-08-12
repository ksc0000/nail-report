```markdown
# Worker Prompt Template

## Context

The application is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage effort by adding unit tests for core Firebase Firestore helper functions. Vitest is the chosen test runner, and Firebase SDK mocking should be utilized.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest, ensuring proper mocking of Firebase SDK dependencies.

## Allowed Scope

- `src/lib/firestore.ts` (minor refactoring for testability is acceptable, but focus on testing existing logic)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vite.config.ts` (if minor adjustments are needed for Vitest configuration, e.g., alias resolution or test setup files)

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
- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Write unit tests for the primary functions within `src/lib/firestore.ts`, such as `addNailItem`, `updateNailItem`, `deleteNailItem`, `getNailItems`, `getNailItem`, `addPublicShare`, and `getPublicShare`.
- Use `vi.mock` to mock Firebase SDK dependencies (e.g., `firebase/firestore`, `firebase/app`).
- Ensure tests cover both successful operations and gracefully handled error scenarios.
- Do not modify existing implementation files unless absolutely necessary to enable testing (e.g., exporting a non-exported helper function).
- If Vitest is not fully set up to run tests in `src/__tests__/`, ensure `vite.config.ts` is updated minimally to allow this.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
