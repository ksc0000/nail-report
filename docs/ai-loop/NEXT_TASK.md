```markdown
# Worker Prompt Template

## Context

The application is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses the "Test coverage" goal by adding unit tests for core helper functions.

## Objective

Implement unit tests for helper functions in `src/lib/firestore.ts` using Vitest, ensuring proper mocking of the Firebase SDK.

## Allowed Scope

- `src/lib/firestore.ts` (for minor adjustments to enable testability if absolutely necessary, but primarily for import)
- `src/__tests__/lib/firestore.test.ts` (new file)
- `src/__tests__/` (for adding new test files)
- `vite.config.ts` (for Vitest configuration if necessary, but prefer existing setup)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` (not relevant for this task)
- Any other `src/lib/` files not directly related to `firestore.ts` testing.

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Create `src/__tests__/lib/firestore.test.ts` to house the new tests.
- Use `vitest` for testing.
- Effectively mock the Firebase Firestore SDK (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `getDoc`, `addDoc`, `updateDoc`, `deleteDoc`) using `vi.mock`.
- Focus on testing the core CRUD helper functions within `src/lib/firestore.ts`, such as `createNailItem`, `updateNailItem`, `deleteNailItem`, `getNailItems`, `getNailItem`, and potentially `getPublicShare` if its logic is distinct enough.
- Aim for clear, isolated unit tests.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
