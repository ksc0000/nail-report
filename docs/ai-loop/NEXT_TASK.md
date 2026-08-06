# Worker Prompt Template

## Context

The product roadmap for nail-report is focused on improving stability, test coverage, and UX in Phase 2. The current state shows that initial AI Loop setup is complete, and a substantive task is pending.

## Objective

Implement unit tests for one or two helper functions within `src/lib/firestore.ts` using Vitest. This directly addresses Phase 2.1 "Test coverage" from the roadmap and aligns with the first "Jules-ready Task".

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability, e.g., named exports if not already present)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (minor additions for Vitest setup if absolutely necessary, but prioritize assuming Vitest is ready)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval; assume Vitest is already a dev dependency)
- Firebase deploy commands
- Secrets and credentials
- Any files or directories not explicitly listed in "Allowed Scope"

## Requirements

- Keep diff ≤ 150 lines. Focus on robust tests for a limited number of functions rather than shallow tests for many.
- Identify one or two key helper functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`) and write comprehensive unit tests for them.
- Use Vitest's mocking capabilities (`vi.mock`) to mock Firebase SDK dependencies (e.g., `firebase/firestore`, `firebase/app`, `firebase/auth`) to ensure tests are isolated and fast.
- Ensure the tests cover expected success paths and relevant error handling paths for the chosen functions.
- Run `npm run build && npm run lint && npm run test` before finishing. (Assume `npm run test` is configured to run Vitest tests).
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
**Acceptance Criteria:**
- A new file `src/__tests__/firestore.test.ts` is created.
- This file contains unit tests for at least one, but no more than two, functions exported from `src/lib/firestore.ts`.
- The tests effectively mock Firebase dependencies and assert correct behavior for the tested functions.
- `npm run test` completes successfully.

**Required test commands:**
```bash
npm install # Ensure all dependencies are installed
npm run build
npm run lint
npm run test
```
