```markdown
# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on stability, test coverage, and UX. The current focus is on improving test coverage for core utility functions.

## Objective

Add unit tests for the Firebase Firestore helper functions located in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (read-only for understanding function signatures and logic)
- `src/__tests__/firestore.test.ts` (new file for tests)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file: `src/__tests__/firestore.test.ts`.
- Write unit tests for the main CRUD helper functions in `src/lib/firestore.ts`. Specifically, target `addNailItem`, `updateNailItem`, `deleteNailItem`, `getNailItems`, and `getNailItem`.
- Mock Firebase SDK calls (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`, `getDocs`, `getDoc`) using `vitest`'s mocking capabilities to isolate the logic of the helper functions.
- Ensure tests cover successful operations for each targeted helper function.
- Keep the overall diff below 150 lines. Focus on essential tests for core functionality rather than comprehensive error handling or edge cases in this task.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
