# Worker Prompt Template

## Context

The product roadmap indicates a need to improve test coverage, specifically for Firebase helper functions. This task focuses on `firestore.ts`.

## Objective

Implement unit tests for helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability if needed)
- `src/__tests__/lib/firestore.test.ts` (new test file)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Use Vitest for writing unit tests.
- Mock Firebase SDK dependencies (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`) as needed to isolate the logic in `firestore.ts`.
- Ensure test coverage for at least the core CRUD operations related to `nailItems` and `publicShares` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, `getShareLink`, `addShareLink`, `updateShareLink`, `deleteShareLink`).
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
