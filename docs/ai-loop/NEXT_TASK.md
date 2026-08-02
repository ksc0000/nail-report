```markdown
# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, which focuses on improving stability, test coverage, and UX. The first sub-phase (2.1) is dedicated to test coverage, specifically mentioning unit tests for Firebase helper functions. This task directly addresses that objective.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally not)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `src/__tests__/lib/__mocks__/firebase-sdk.ts` (new file for Firebase SDK mocking)
- `vite.config.ts` (potentially minor updates for Vitest config if necessary, but avoid if possible)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files outside the `src/lib/firestore.ts`, `src/__tests__/` directory, or `vite.config.ts`.

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Mock the Firebase SDK as needed using `vi.mock` to ensure tests are isolated and do not interact with actual Firebase services. A separate mock file `src/__tests__/lib/__mocks__/firebase-sdk.ts` is encouraged for reusability.
- Add unit tests for at least two different helper functions within `src/lib/firestore.ts`. Focus on functions that interact with Firestore (e.g., `addDoc`, `getDocs`, `updateDoc`, `deleteDoc` wrappers).
- Ensure tests cover basic success cases.
- Run `npm run test` to verify tests pass.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
