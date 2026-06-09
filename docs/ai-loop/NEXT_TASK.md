```markdown
# Worker Prompt Template

## Context

The product roadmap indicates that improving test coverage is a key objective in Phase 2. Specifically, unit tests for core Firebase helper functions are needed to enhance stability. The current state shows no completed tasks, making this an ideal starting point for Phase 2.

## Objective

Add Vitest unit tests for the helper functions in `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (for minor adjustments to facilitate testing, e.g., exporting private functions if necessary)
- `src/__tests__/` (to create new test files)
- `vitest.config.ts` (if minor configuration changes are needed for mocking)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` or other UI-related files (unless directly required for a very minor test setup, but unlikely for this task)

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Worker Prompt

Your primary goal is to write comprehensive unit tests for the helper functions located in `src/lib/firestore.ts`.

1.  **Create a new test file:** Create `src/__tests__/firestore.test.ts`.
2.  **Use Vitest:** Utilize Vitest as the test runner.
3.  **Mock Firebase SDK:** Ensure that actual Firebase interactions (e.g., `getFirestore`, `collection`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`) are thoroughly mocked using `vi.mock` to keep tests isolated, fast, and independent of a live Firebase project.
4.  **Test helper functions:** Focus on testing the public helper functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, etc.).
5.  **Cover various scenarios:**
    *   Successful data operations (add, get, update, delete).
    *   Error handling (e.g., Firestore throwing an error during an operation).
    *   Correct input/output mapping.
    *   Edge cases for input data where applicable.
6.  **Ensure good coverage:** Aim for good test coverage for the functions within `src/lib/firestore.ts`.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
