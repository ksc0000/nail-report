# Worker Prompt Template

## Context

The current roadmap for `nail-report` is in Phase 2, focusing on stability, test coverage, and UX improvements. The immediate goal is to enhance test coverage, specifically for Firebase helper functions.

## Objective

Implement unit tests for a few key helper functions in `src/lib/firestore.ts` using Vitest, focusing on mocking Firebase SDK dependencies.

## Allowed Scope

- `src/lib/firestore.ts` (for minor adjustments to enable testing, if necessary)
- `src/__tests__/lib/firestore.test.ts` (new file)
- `vite.config.ts` (for Vitest configuration/setup, if needed)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run test` (to ensure tests pass) and `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

1.  **Create Test File:** Create a new test file at `src/__tests__/lib/firestore.test.ts`.
2.  **Vitest Setup:** Configure Vitest within this test file to effectively mock the Firebase Firestore SDK (e.g., `firebase/firestore`). Ensure no actual network calls are made to Firebase.
3.  **Implement Tests:** Write comprehensive unit tests for at least two of the following helper functions found in `src/lib/firestore.ts`:
    *   `getNailItems`
    *   `addNailItem`
    *   `updateNailItem`
    *   `deleteNailItem`
    *   `getNailItem`
    *   `updateNailItemTags`
    *   `addPublicShare`
    *   `getPublicShare`
4.  **Coverage:** Ensure the tests cover basic functionality and relevant success/failure scenarios for the chosen functions, all purely through mocking.
5.  **No New Dependencies:** Do not add any new npm packages to `package.json`. Vitest is already configured.
6.  **Verify:** Run `npm run test` to confirm all tests pass, then `npm run build && npm run lint` to ensure no build or linting errors.
