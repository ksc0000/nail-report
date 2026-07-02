```markdown
# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. The current state indicates that the first substantive task for Phase 2 is pending. This task will initiate the test coverage efforts outlined in section 2.1 of the roadmap.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. This task involves configuring Vitest (if necessary, assuming it's already installed as a dev dependency) and writing comprehensive unit tests for the core Firestore interaction functions.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability are permissible, but no functional changes unless strictly required)
- `src/__tests__/lib/firestore.test.ts` (new file for the unit tests)
- `vite.config.ts` (for Vitest configuration, e.g., test runner settings, mocking configurations)
- `package.json` (to add/modify test scripts, e.g., `"test": "vitest"`, but **no new npm dependencies**)
- `tsconfig.json` (if necessary to include Vitest types)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval; Vitest is assumed to be an existing dev dependency)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- **Add unit tests for all exported helper functions in `src/lib/firestore.ts`** (e.g., `addDocument`, `updateDocument`, `deleteDocument`, `getDocumentsInCollection`, etc.).
- Configure Vitest appropriately within `vite.config.ts` to run these tests.
- Effectively mock the Firebase SDK (Firestore) within the tests to isolate the logic of the helper functions from actual Firebase interactions.
- Ensure tests cover success cases and potential error handling where applicable (e.g., if a function explicitly catches and re-throws errors).

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
