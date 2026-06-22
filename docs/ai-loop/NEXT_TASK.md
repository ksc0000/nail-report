# Worker Prompt Template

## Context

The nail-report application is currently in Phase 2, focusing on improving stability, test coverage, and UX. A key part of this phase is adding comprehensive test coverage, starting with core utility functions. This task specifically targets the Firebase Firestore helper functions.

## Objective

Add Vitest unit tests for the helper functions implemented in `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing if necessary, or minor fixes)
- `src/__tests__/firestore.test.ts` (new file for unit tests)
- `src/__tests__/` (other new test files as needed for mocks)
- `package.json` (minor devDependencies adjustments if strictly necessary for testing, e.g., `@testing-library/react` if needed for component mocks, but avoid new core dependencies)
- `vite.config.ts` (adjustments for Vitest configuration if needed for mocking Firebase SDK)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- New npm packages in `dependencies` (only `devDependencies` if essential for testing)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Ensure all relevant helper functions within `src/lib/firestore.ts` are covered by unit tests.
- Use `vitest` and `vi.mock` to mock Firebase SDK dependencies (e.g., `firebase/firestore`).
- Focus on testing the logic within `firestore.ts`, not the Firebase SDK itself.
- Run `npm run build && npm run lint && npm test` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
### **WORKER OUTPUT (to be filled by Jules)**

## Summary of what changed
*(Jules will fill this)*

## Changed files list
*(Jules will fill this)*

## Commands run and results
```bash
# (Jules will run these commands and paste results here)
npm run build
npm run lint
npm test
```

## Known issues or limitations
*(Jules will fill this)*

## Suggested next task
Add loading skeleton to nail item list (`src/App.tsx`). This aligns with Phase 2.3 (Loading states) of the roadmap.
