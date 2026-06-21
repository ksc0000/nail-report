```markdown
# Worker Prompt Template

## Context

The current phase (Phase 2.1) of the roadmap focuses on improving test coverage for the application's core logic. Your task is to begin adding unit tests for the Firebase helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest and mock the Firebase SDK to ensure isolated testing. Focus on the main CRUD operations (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`) if they exist as helpers.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability, e.g., exporting unexported helpers)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `src/__mocks__/firebase.ts` (new file for Firebase SDK mocks, or modifications to an existing mock setup if found)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Ensure tests effectively mock the Firebase SDK (`firebase/firestore` and `firebase/auth`) to prevent actual database calls.
- Aim for high test coverage for the tested functions.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
