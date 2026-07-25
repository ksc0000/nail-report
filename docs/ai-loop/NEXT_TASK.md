```markdown
# Worker Prompt Template

## Context

The current phase (Phase 2) of the roadmap focuses on improving stability, test coverage, and UX. This task directly addresses the "2.1 Test coverage" objective by adding unit tests for core Firestore helper functions. Establishing good test coverage for these foundational utilities will improve the overall stability of the application.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. Focus on mocking the Firebase SDK correctly to ensure true unit tests.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability, if necessary)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (only if absolutely necessary for Vitest configuration, but assume basic Vitest setup is complete)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/lib/storage.ts` or `src/lib/auth.ts` (these will be separate tasks)
- `src/App.css` or other UI-related CSS files

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Mock the Firebase Firestore SDK (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `getDoc`, `addDoc`, `updateDoc`, `deleteDoc`) using `vi.mock` to isolate the functions under test from actual Firebase calls.
- Write unit tests for the primary CRUD helper functions related to `nailItems` in `src/lib/firestore.ts`, such as `addNailItem`, `getNailItems`, `getNailItem`, `updateNailItem`, and `deleteNailItem`.
- Ensure tests cover successful operations and basic error handling cases (e.g., a Firestore operation failing).

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
