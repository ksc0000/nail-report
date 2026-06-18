```markdown
# Worker Prompt Template

## Context

The product roadmap for `nail-report` is actively in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage effort by adding unit tests for core Firebase helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, specifically targeting CRUD operations for nail items.

## Allowed Scope

- `src/lib/firestore.ts` (for minor adjustments to enable testing, if necessary)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vite.config.ts` (for minimal Vitest configuration if not already present/configured)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Add a new test file: `src/__tests__/lib/firestore.test.ts`.
- Write unit tests for the following functions in `src/lib/firestore.ts`:
    - `addNailItem`
    - `getNailItems`
    - `updateNailItem`
    - `deleteNailItem`
- Mock Firebase SDK interactions (e.g., `firebase/firestore` methods like `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`) as necessary to isolate the functions under test.
- Ensure all new tests pass.
- Keep the overall diff for the PR to a maximum of 150 lines.
- Run `npm run build && npm run lint` successfully before marking the task complete.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
