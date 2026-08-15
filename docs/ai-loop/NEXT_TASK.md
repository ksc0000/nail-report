# Worker Prompt Template

## Context

The product roadmap prioritizes improving stability and test coverage in Phase 2.1. This task focuses on establishing foundational unit tests for the core Firestore utility functions.

## Objective

Implement initial Vitest unit tests for the main CRUD helper functions within `src/lib/firestore.ts`, focusing on interactions with the `nailItems` collection. This includes setting up Firebase SDK mocking.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally minimal changes to the original logic)
- `src/__tests__/firestore.test.ts` (new file)
- `vite.config.ts` (to configure Vitest if not already done, though it's assumed Vitest is already set up)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Use Vitest for testing.
- Mock the Firebase SDK (e.g., `firebase/firestore`) to prevent actual database calls during tests, following Vitest's `vi.mock` pattern.
- Write tests for at least two core functions in `src/lib/firestore.ts` related to `nailItems` CRUD (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Ensure tests cover basic success cases.
- Run `npm run build && npm run lint && npm test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
