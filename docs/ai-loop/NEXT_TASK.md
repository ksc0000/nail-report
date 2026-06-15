# Worker Prompt Template

## Context

The AI Loop is currently in Phase 2 of the roadmap, focusing on improving stability, test coverage, and UX. The current state reflects that the AI-LOOP setup is complete and the first substantive task is pending. This task will initiate test coverage improvements.

## Objective

Add Vitest unit tests for helper functions located in `src/lib/firestore.ts`. This involves writing tests that mock Firebase SDK dependencies and verify the core functionality of the Firestore helper functions.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally not substantial logic changes)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (for Vitest configuration, especially for mocking Firebase)
- `package.json` (only for checking existing dev dependencies like `vitest`, no new dependencies should be added)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval beyond what is already configured for Vitest)
- Firebase deploy commands
- Secrets and credentials
- Any files or directories not explicitly listed in "Allowed Scope"

## Requirements

- Keep diff ≤ 150 lines.
- Create at least one new test file, e.g., `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`) using Vitest's mocking capabilities where necessary to isolate unit tests.
- Cover at least the `getNailItems` and `addNailItem` functions with basic unit tests.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Ensure all tests pass.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
