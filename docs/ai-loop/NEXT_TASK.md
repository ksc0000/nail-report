# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on stability, test coverage, and UX. This task initiates the test coverage effort by adding unit tests for core Firebase helper functions.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`. Focus on mocking the Firebase SDK to ensure tests are isolated and efficient.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability are allowed if absolutely necessary, but focus on testing existing logic)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (if minor configuration is needed for mocks, but avoid if possible)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files or directories not explicitly listed in "Allowed Scope"

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two significant helper functions within `src/lib/firestore.ts`. Examples include `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`.
- **Mock Firebase SDK:** Utilize `vi.mock` (Vitest's mocking API) to mock Firestore SDK calls (e.g., `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`) to prevent actual Firebase interactions during tests.
- Ensure tests cover basic success cases for the chosen functions.
- Run `npm run build && npm run lint && npm test` before finishing. All checks must pass.
- Prefer adding tests when touching `src/lib/` files (this task is explicitly about adding tests).
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
