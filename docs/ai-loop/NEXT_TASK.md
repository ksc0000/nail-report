# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, which focuses on improving stability, test coverage, and UX. This task initiates the test coverage effort by adding unit tests for core Firebase helper functions. `src/lib/firestore.ts` contains critical functions for managing nail items in Firestore, making it a high priority for robust testing.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. This task focuses on testing the CRUD operations related to `nailItems`.

## Allowed Scope

- `src/lib/firestore.ts` (minor refactoring for testability is allowed, but no changes to core logic or external behavior)
- `src/__tests__/` (for creating new test files, e.g., `src/__tests__/firestore.test.ts`, and any necessary test utility files)
- `package.json` (only for adding or modifying a `test` script to run Vitest, e.g., `"test": "vitest"`. **DO NOT add new `dependencies` or `devDependencies`.**)
- `vite.config.ts` (only for adding or modifying `test` configuration settings for Vitest if absolutely necessary, e.g., `test: { environment: 'jsdom' }`. **DO NOT add new plugins that introduce new npm dependencies.**)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval - this explicitly means **do not add new entries to `dependencies` or `devDependencies`**. Only modify existing scripts/config.)
- Firebase deploy commands
- Secrets and credentials
- Any other files not explicitly listed in "Allowed Scope".

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Focus on testing the core CRUD functions in `src/lib/firestore.ts` such as `getNailItems`, `addNailItem`, `updateNailItem`, and `deleteNailItem`.
- Use `vi.mock` to mock Firebase SDK functions (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`) to ensure tests are isolated and do not interact with actual Firebase services.
- Ensure tests cover both successful operations and basic error handling for Firestore interactions.
- Run `npm run build && npm run lint && npm run test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
*Self-correction by the AI loop:*
*Initial thought was to include `package.json` for adding Vitest as a `devDependency`, but the "no new npm dependencies" constraint is strict. The roadmap indicates Vitest is the chosen runner, implying it should already be available or its setup is a prior, separate task. Thus, I refined the allowed scope to only touch `package.json` for scripts/config, not deps.*
*This task assumes Vitest is either already installed as a `devDependency` or the user agent is expected to report if it's not and the task cannot proceed without violating the constraint.*
