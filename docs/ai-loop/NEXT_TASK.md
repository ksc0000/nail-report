```markdown
# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. The current state indicates that no substantive application feature tasks from Phase 2 have been completed yet. One of the high-priority items in Phase 2 is to increase test coverage, specifically for helper functions.

## Objective

Implement unit tests for two core helper functions in `src/lib/firestore.ts` (e.g., functions responsible for adding and retrieving nail items) using Vitest. This task requires mocking the Firebase SDK to ensure the unit tests focus on the logic within the helper functions themselves, without making actual calls to Firestore.

## Allowed Scope

- `src/lib/firestore.ts` (Minor modifications for testability are allowed, but prefer not to alter existing application logic if possible.)
- `src/__tests__/firestore.test.ts` (New file for unit tests)
- `vite.config.ts` (Only for minimal Vitest configuration if absolutely necessary, e.g., to define global mocks or a test environment.)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` (do not add new npm packages or modify existing scripts without explicit human approval. Assume Vitest is already installed as a dev dependency, and a `test` script exists, if not, report as a comment.)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep the total diff of the PR to ≤ 150 lines.
- Create a new test file named `src/__tests__/firestore.test.ts`.
- Identify and implement unit tests for two distinct, key helper functions within `src/lib/firestore.ts` (e.g., functions for creating a nail item and fetching nail items).
- Effectively mock Firebase Firestore SDK interactions (e.g., `getFirestore`, `collection`, `addDoc`, `getDocs`, `query`, `where`, etc.) using `vi.mock` to ensure tests are isolated.
- The tests should cover at least the basic success path for the chosen functions.
- Run `npm run build && npm run lint` and ensure no errors before finishing the task.
- Report any missing Vitest setup (e.g., `package.json` scripts) as comments, rather than implementing them directly.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
