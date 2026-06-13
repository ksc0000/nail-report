```markdown
# Worker Prompt Template

## Context

The `nail-report` application requires improved test coverage, particularly for its core Firebase utility functions. This task focuses on adding unit tests for the Firestore helper functions to enhance stability and reliability. The chosen test runner is Vitest, as specified in the roadmap.

## Objective

Implement unit tests for at least two core helper functions within `src/lib/firestore.ts` using Vitest. This will involve creating a new test file and mocking Firebase SDK interactions.

## Allowed Scope

- `src/lib/firestore.ts` (for understanding the functions to be tested)
- `src/__tests__/firestore.test.ts` (new file for unit tests)
- `package.json` (only for checking existing `vitest` configuration, no new deps)
- `vite.config.ts` (only for checking existing `vitest` configuration)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` (no new npm packages without human approval, verify `vitest` is already listed)
- Firebase deploy commands
- Secrets and credentials
- Modifying existing application logic outside of `src/lib/firestore.ts` if strictly necessary for testability (prefer mocking).

## Requirements

- Keep the diff ≤ 150 lines.
- Create `src/__tests__/firestore.test.ts`.
- Add tests for at least two functions like `createNailItem`, `updateNailItem`, or `deleteNailItem`.
- Mock Firebase SDK functions (e.g., `doc`, `collection`, `setDoc`, `updateDoc`, `deleteDoc`) using `vitest.mock` to ensure tests are isolated and do not interact with a live Firestore instance.
- Ensure tests cover basic success cases for the chosen functions.
- Run `npm run build && npm run lint` before finishing and report any issues.
- Run `npm test` and ensure all new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---

## Suggested Next Task (for AI Loop)

Add loading skeleton to nail item list (`src/App.tsx`)
```
