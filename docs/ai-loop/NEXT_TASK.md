```markdown
# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically targets **2.1 Test coverage**. The goal is to begin adding unit tests for the Firebase helper functions, starting with Firestore.

## Objective

Implement Vitest and add unit tests for the core helper functions in `src/lib/firestore.ts`. Focus on mocking Firebase SDK interactions for at least `addNailItem` and `getNailItems`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, or minor refactor for testability)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vite.config.ts` (if Vitest setup is needed, but typically it's already configured for a Vitest project)
- `package.json` (only to confirm `vitest` scripts exist, *no new npm dependencies*)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Write unit tests that cover at least the `addNailItem` and `getNailItems` functions in `src/lib/firestore.ts`.
- Use `vi.mock` from Vitest to mock Firebase Firestore SDK interactions (e.g., `doc`, `collection`, `setDoc`, `getDocs`, `query`, `where`).
- Ensure tests are isolated and do not interact with actual Firebase services.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
**Suggested next task for AI Loop:** Add Vitest + unit tests for `src/lib/storage.ts` helpers.
```
