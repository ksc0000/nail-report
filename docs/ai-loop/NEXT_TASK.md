# Worker Prompt Template

## Context

The current phase of the roadmap focuses on improving stability, test coverage, and UX. This task initiates the test coverage effort by adding unit tests for core Firebase Firestore helper functions.

## Objective

Implement unit tests for the `addNailItem` and `getNailItems` helper functions located in `src/lib/firestore.ts` using Vitest. The tests should mock Firebase SDK calls to ensure isolation and predictability.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing)
- `src/__tests__/firestore.test.ts` (new file for unit tests)
- `vite.config.ts` (only if absolutely necessary for Vitest configuration, but assume Vitest is generally set up)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file `src/__tests__/firestore.test.ts`.
- Write unit tests for `addNailItem` and `getNailItems` functions.
- Mock Firebase Firestore SDK functions (e.g., `collection`, `addDoc`, `getDocs`, `query`, `orderBy`) using `vi.mock('firebase/firestore')`.
- Ensure tests verify successful operations and handle potential errors gracefully (e.g., by checking for expected return values or error throwing).
- Keep the overall diff size to less than 150 lines.
- Run `npm test`, `npm run build`, and `npm run lint` before finishing and ensure all pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
