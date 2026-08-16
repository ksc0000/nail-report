# Worker Prompt Template

## Context

The current roadmap is in Phase 2, focusing on improving stability, test coverage, and UX. This task addresses Phase 2.1: Test coverage. The application uses Vitest for testing. The goal is to improve the robustness of our Firebase interactions by adding unit tests for core Firestore helper functions.

## Objective

Implement unit tests for helper functions within `src/lib/firestore.ts`. The focus for this task should be on the `addNailItem` and `getNailItems` functions, ensuring they handle success and error cases correctly by mocking Firebase SDK dependencies.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes if needed for testability)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (if Vitest setup is incomplete, minimal changes)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Use Vitest for writing tests.
- Mock Firebase SDK (specifically `firebase/firestore` functions like `collection`, `addDoc`, `getDocs`, etc.) to isolate `firestore.ts` logic.
- Cover at least the `addNailItem` and `getNailItems` functions.
- Include tests for both successful operations and error handling scenarios (e.g., database write/read failures).
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
