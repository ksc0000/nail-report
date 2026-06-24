```markdown
# Worker Prompt Template

## Context

The current phase of the roadmap focuses on improving stability, test coverage, and UX. This task specifically addresses the "2.1 Test coverage" goal by adding unit tests for core Firebase utility functions.

## Objective

Implement unit tests for the helper functions in `src/lib/firestore.ts` using Vitest, focusing on mocking Firebase SDK interactions.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability, if necessary)
- `src/__tests__/firestore.test.ts` (new file)
- `vite.config.ts` (for Vitest setup, if not already configured)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files outside the `src/` directory (except `vite.config.ts` if Vitest setup is needed)
- `src/App.tsx`, `src/App.css`, or any UI components

## Requirements

- Create a new test file: `src/__tests__/firestore.test.ts`.
- Add unit tests for functions within `src/lib/firestore.ts`, such as `getNailItems`, `addNailItem`, `updateNailItem`, and `deleteNailItem`.
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`) using Vitest's `vi.mock()` to isolate `firestore.ts` logic.
- Ensure tests verify the correct interaction with the mocked Firestore instance (e.g., `collection`, `doc`, `setDoc`, `getDocs`, `deleteDoc` calls with expected arguments).
- Keep the diff for this task minimal, aiming for ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing to ensure code quality and build success.
- Do not modify any existing tests or test configurations outside of adding the new `firestore.test.ts` file and potentially updating `vite.config.ts` for Vitest if absolutely necessary.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
