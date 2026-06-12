```markdown
# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, focusing on improving stability, test coverage, and UX. This task contributes to the "2.1 Test coverage" goal by adding unit tests for core Firestore helper functions. Vitest is already established as the test runner.

## Objective

Implement unit tests for key Firestore helper functions located in `src/lib/firestore.ts` using Vitest and `vi.mock` to mock Firebase SDK dependencies.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but preferably just test them)
- `src/lib/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only to add a test script if missing, but no new dependencies)
- `vite.config.ts` (if Vitest configuration is needed, e.g., for aliasing or globals)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval; Vitest is assumed to be present)
- Firebase deploy commands
- Secrets and credentials
- Any files outside `src/` except for potential Vitest config.

## Requirements

- Create a new test file: `src/lib/__tests__/firestore.test.ts`.
- Write unit tests for at least two core CRUD functions from `src/lib/firestore.ts`, such as `addNailItem` and `getNailItems`.
- Use `vi.mock` to mock Firebase SDK functions (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`, etc.) to isolate the functions under test.
- Ensure the tests assert expected outcomes (e.g., correct data is passed to mocked Firebase functions, correct values are returned by helpers).
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Run `npm run test` (or equivalent Vitest command) to ensure tests pass.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
**Suggested next task:** Add Vitest + unit tests for `src/lib/storage.ts` helpers
```
