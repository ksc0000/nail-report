# Worker Prompt Template

## Context

The current phase (Phase 2) focuses on improving stability, test coverage, and UX. Our immediate goal is to enhance test coverage for core utility functions. This task specifically targets adding unit tests for Firestore helper functions to ensure their reliability.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`, focusing on mocking the Firebase Firestore SDK to test the logic of these functions in isolation.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to integrate with testing, if necessary, but primarily adding tests)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (to configure Vitest if not already done)
- `package.json` (to add Vitest scripts if not already done)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no *new* npm packages without human approval, but modifying scripts for existing `vitest` is allowed)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Set up Vitest if not already configured, specifically for TypeScript and mocking.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two key helper functions in `src/lib/firestore.ts` (e.g., `getNailItems`, `addNailItem`).
- Ensure Firebase Firestore SDK functions (`collection`, `getDocs`, `addDoc`, etc.) are properly mocked using `vi.mock('firebase/firestore')` to prevent actual Firebase calls during tests.
- The tests should verify the correct arguments are passed to the mocked Firebase functions and that the helper functions return expected results based on mocked data.
- Run `npm run test` (or equivalent Vitest command) to ensure tests pass.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
