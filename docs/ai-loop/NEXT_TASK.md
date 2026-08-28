# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. The first priority in Phase 2 is to increase test coverage, starting with helper functions.

## Objective

Implement unit tests for the functions within `src/lib/firestore.ts` using Vitest. The tests should mock Firebase SDK dependencies to ensure unit isolation.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes to export functions if needed for testing, but ideally not)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (only if necessary for basic test configuration, e.g., alias paths)

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
- Write unit tests for at least `addNailItem` and `getNailItems` functions in `src/lib/firestore.ts`.
- Use Vitest's mocking capabilities (`vi.mock`) to mock Firebase Firestore SDK calls (e.g., `getFirestore`, `collection`, `addDoc`, `getDocs`).
- Ensure the tests cover successful operations and basic error handling scenarios (e.g., a Firestore operation failing).
- Run `npm run build && npm run lint && npm test` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
