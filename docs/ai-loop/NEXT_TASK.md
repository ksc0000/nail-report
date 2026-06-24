# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task.

The current phase (Phase 2) focuses on improving stability, test coverage, and UX. This task specifically addresses Phase 2.1: Test coverage, by adding unit tests for crucial Firebase Firestore helper functions.

## Objective

Implement Vitest unit tests for the functions within `src/lib/firestore.ts` to ensure their correct interaction with Firebase Firestore. Focus on mocking Firebase SDK calls to test the logic in isolation.

## Allowed Scope

- `src/lib/firestore.ts` (minimal modifications for testability, if necessary)
- `src/__tests__/firestore.test.ts` (create this new file)
- `vite.config.ts` (only for adding basic Vitest configuration if missing, but primary focus is on writing tests)
- `package.json` (only to add `test` script if missing, no new dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Mock Firebase Firestore SDK interactions (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`) using `vitest`'s `vi.mock` for isolated testing.
- Write tests for the core CRUD operations implemented in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Run `npm run build && npm run lint && npm test` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
