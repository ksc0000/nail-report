# Worker Prompt Template

## Context

The nail-report application is currently in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. A key area for improvement is adding unit tests for core helper functions that interact with Firebase services. The `src/lib/firestore.ts` file contains critical logic for managing nail items in Firestore.

## Objective

Implement comprehensive unit tests for the functions within `src/lib/firestore.ts` using Vitest. This involves mocking Firebase SDK methods to ensure tests are isolated and run efficiently without actual Firebase calls.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments to aid testability, if necessary, but focus on creating external tests)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (if Vitest configuration is not already present or needs minor adjustment for test discovery)

## Forbidden Scope

- `src/main.tsx`
- `commands/`
- `firestore.rules`, `storage.rules`
- `package.json` deps (no new npm packages)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file, `src/__tests__/firestore.test.ts`.
- Write unit tests for the primary functions in `src/lib/firestore.ts`, such as `getNailItems`, `addNailItem`, `updateNailItem`, and `deleteNailItem`.
- Use `vitest` and `vi.mock` to mock Firebase SDK functions (e.g., `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`) to simulate Firestore interactions without making actual network calls.
- Ensure tests cover successful operations and potential error scenarios.
- Keep the overall diff for this task to ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing to ensure code quality and build integrity.
- Report any follow-up items or potential improvements as comments within the PR, rather than implementing them directly.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
