# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on stability, test coverage, and UX improvements. The current state shows that initial AI Loop setup is complete, and a first substantive task is pending.

This task specifically targets Phase 2.1: Test coverage, by adding unit tests for existing helper functions.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`. Focus on covering basic CRUD operations and data serialization/deserialization where applicable.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but primarily adding tests)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `package.json` (only if absolutely necessary for Vitest configuration, but assume Vitest is already installed as per roadmap)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no *new* npm packages without human approval; assume Vitest is already installed)
- Firebase deploy commands
- Secrets and credentials
- Any other files not explicitly mentioned in 'Allowed Scope'

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies as needed using `vi.mock` from Vitest.
- Cover at least the `getCollection`, `getDoc`, `addDoc`, `updateDoc`, and `deleteDoc` helper functions within `src/lib/firestore.ts` (or equivalent functions if names differ).
- Ensure tests run successfully and provide meaningful coverage for the tested functions.
- Run `npm run build && npm run lint && npm test` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
