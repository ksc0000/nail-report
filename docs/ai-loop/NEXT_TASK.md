```markdown
# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage efforts by targeting a core utility file.

## Objective

Implement Vitest unit tests for the helper functions located in `src/lib/firestore.ts`.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/` helpers (firestore.ts, storage.ts, auth.ts, publicShares.ts)
- `src/__tests__/` (new test files)
- `src/App.css` (CSS improvements)

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
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Worker prompt

Your task is to implement Vitest unit tests for the helper functions located in `src/lib/firestore.ts`.

1.  **Create a new test file**: Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK**: You will need to mock Firebase Firestore SDK functions (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`, `query`, `where`, etc.) to isolate the functions under test. Refer to Vitest's `vi.mock` capabilities for this.
3.  **Write Tests**: Implement unit tests for at least two key functions within `src/lib/firestore.ts`. Focus on covering happy paths and common error scenarios. Examples include functions for adding, updating, or retrieving nail items.
4.  **Run Tests**: Ensure the new tests pass by running the Vitest command (`npm test` or `vitest`).

### Summary of what changed

(To be filled by the worker upon completion)

### Changed files list

(To be filled by the worker upon completion)

### Commands run and results

(To be filled by the worker upon completion)

### Known issues or limitations

(To be filled by the worker upon completion)

### Suggested next task

Add Vitest + unit tests for `src/lib/storage.ts` helpers.
```
