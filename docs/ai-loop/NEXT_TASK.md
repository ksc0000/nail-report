# Worker Prompt Template

## Context

The product roadmap for nail-report includes improving test coverage for Firebase helper functions in Phase 2.1. This task focuses on adding unit tests for the Firestore-related helper functions.

## Objective

Implement initial unit tests for key helper functions within `src/lib/firestore.ts` using Vitest, specifically targeting CRUD operations for `nailItems`.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability if strictly necessary, but prefer not)
- `src/__tests__/` (new test file, e.g., `src/__tests__/firestore.test.ts`)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files outside `src/` except for new test files in `src/__tests__/`

## Requirements

- Create a new test file, for example, `src/__tests__/firestore.test.ts`.
- Add unit tests for at least two core functions in `src/lib/firestore.ts`, such as `addNailItem` and `getNailItems`.
- Mock Firebase SDK dependencies (e.g., `getFirestore`, `collection`, `addDoc`, `getDocs`, etc.) using `vi.mock` as per Vitest documentation. Do not actually connect to a real Firebase project.
- Ensure the tests cover basic success cases and provide meaningful assertions.
- Keep the overall diff for the PR to ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- The tests should pass when `npm run test` is executed.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
