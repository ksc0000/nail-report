# Worker Prompt Template

## Context

The current roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage efforts by targeting core utility functions.

## Objective

Implement unit tests for key helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing)
- `src/__tests__/` (for creating new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (minor additions for path aliases or globals if strictly necessary for mocking)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, `src/__tests__/firestore.test.ts`.
- Focus on writing comprehensive unit tests for at least 2-3 independent helper functions within `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `deleteNailItem`).
- Utilize Vitest's mocking capabilities (`vi.mock`) to mock Firebase SDK dependencies (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `setDoc`, `deleteDoc`) to isolate the logic being tested.
- Ensure the tests accurately cover success and basic error paths for the selected functions.
- Run `npm run test` and ensure all tests pass.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
