# Worker Prompt Template

## Context

The product roadmap prioritizes improving stability and test coverage in Phase 2. The current state shows that test coverage for utility functions is a key area of focus. This task aims to kickstart the test coverage efforts by targeting core Firestore helper functions.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally not)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/__tests__/` (other new test files as needed for setup/mocks)
- `vite.config.ts` (minor additions for Vitest setup if absolutely necessary, but prioritize existing setup)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file: `src/__tests__/firestore.test.ts`.
- Write unit tests for the key helper functions in `src/lib/firestore.ts`, such as `getNailItems`, `getNailItem`, `addNailItem`, `updateNailItem`, `deleteNailItem`, `getPublicShareLink`, `addPublicShareLink`, `deletePublicShareLink`, etc.
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`, `firebase/auth`) using `vitest`'s mocking capabilities to isolate the logic being tested. Do not make actual calls to Firebase during tests.
- Ensure the tests cover success cases and relevant error handling paths for these functions.
- Keep the diff ≤ 150 lines. Focus on testing a significant portion of the helpers, not necessarily 100% coverage in this single PR.
- Run `npm run build && npm run lint` before finishing to ensure code quality and build integrity.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
