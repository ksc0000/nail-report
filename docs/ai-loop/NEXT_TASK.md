# Worker Prompt

## Context

The current phase is 2.0, focusing on improving stability, test coverage, and UX. This task initiates the test coverage efforts by targeting core Firebase interaction helper functions. The roadmap explicitly calls for Vitest integration and unit tests for `src/lib/firestore.ts` helpers.

## Objective

Add Vitest unit tests for the helper functions in `src/lib/firestore.ts`. This includes setting up Vitest if it's not already configured, creating a dedicated test file, mocking Firebase Firestore SDK, and writing tests for key CRUD operations.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but focus on testing existing logic)
- `src/__tests__/firestore.test.ts` (new test file)
- `package.json` (to add `vitest` and test script if not present, as per roadmap approval in Phase 2.1)
- `vite.config.ts` (to add Vitest configuration if not present)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- Any new npm packages not explicitly approved by the roadmap (Vitest is approved)
- Firebase deploy commands
- Secrets and credentials
- Other `src/` files not directly related to `firestore.ts` testing.

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Worker prompt

### Task Breakdown

1.  **Vitest Setup Verification:**
