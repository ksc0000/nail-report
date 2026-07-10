# Worker Prompt Template

## Context

The current phase focuses on improving stability, test coverage, and UX. This task initiates the test coverage efforts by targeting a core utility file.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, focusing initially on `nailItems` CRUD operations (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`).

## Allowed Scope

- `src/lib/firestore.ts` (for minor adjustments needed to facilitate testing, e.g., exports, or small bug fixes found during testing)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/__mocks__/` (new files for Firebase SDK mocks, if required)
- `vite.config.ts` (only if absolutely necessary for basic Vitest configuration, and keep changes minimal)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new *runtime* npm packages without human approval; `vitest` is assumed as a `devDependency` from the roadmap and should either be present or its addition as a dev dependency is implied for testing setup)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep the diff ≤ 150 lines. Focus on a few key functions to stay within limits.
- Use Vitest as the test runner.
- Mock the Firebase SDK (Firestore specifically) using `vi.mock` to ensure tests are true unit tests, not integration tests.
- Ensure tests cover basic success cases for the selected CRUD operations.
- Run `npm run build && npm run lint` before finishing.
- Report any issues with Vitest setup or the inability to mock Firebase SDK effectively as known issues.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
