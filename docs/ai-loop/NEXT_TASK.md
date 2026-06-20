# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. Specifically, Phase 2.1 aims to add unit tests for critical helper functions. This task addresses the initial step of improving test coverage for Firestore operations.

## Objective

Implement unit tests for the `addNailItem` and `deleteNailItem` functions located in `src/lib/firestore.ts`. These tests should use Vitest and appropriately mock Firebase Firestore SDK interactions to ensure isolated testing.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability if necessary, e.g., named exports)
- `src/__tests__/firestore.test.ts` (create this new test file)
- `package.json` (only if adding a `test` script for Vitest if it's missing, but *not* adding new dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval, Vitest is assumed to be configured or installable as a dev dependency without requiring *new* approval)
- Firebase deploy commands
- Secrets and credentials
- Any other files or directories not explicitly listed in "Allowed Scope"

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Mock Firebase Firestore SDK methods (e.g., `addDoc`, `deleteDoc`, `doc`, `collection`) used by `addNailItem` and `deleteNailItem`.
- Ensure the tests verify the functions interact correctly with the mocked Firestore.
- Run `npm test` (or the equivalent Vitest command) to ensure tests pass.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
**Acceptance Criteria:**
- A new file `src/__tests__/firestore.test.ts` exists.
- This file contains passing unit tests for `addNailItem` and `deleteNailItem`.
- Firebase Firestore SDK calls within these tests are properly mocked.
- `npm run build` and `npm run lint` pass without errors.
- The PR diff is under 150 lines.

**Required Test Commands:**
```bash
npm test
npm run build
npm run lint
```
