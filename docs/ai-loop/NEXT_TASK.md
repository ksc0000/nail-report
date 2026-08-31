```markdown
# Worker Prompt Template

## Context

The application needs improved test coverage, starting with core Firebase helper functions. `src/lib/firestore.ts` contains crucial logic for interacting with Firestore, and these functions need robust unit tests to ensure their stability and correctness. Vitest is the chosen test runner, and Firebase SDK interactions should be mocked.

## Objective

Implement unit tests for helper functions within `src/lib/firestore.ts` using Vitest, focusing on mocking Firebase SDK calls.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes for testability if necessary)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vite.config.ts` (only for minimal Vitest configuration if absolutely required, e.g., enabling globals; assumes Vitest is already an installed dev dependency)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files outside the `src/` directory, except `vite.config.ts` as specified above.

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Mock Firebase SDK dependencies using `vi.mock` to isolate the functions under test.
- Aim for good coverage of the existing helper functions in `src/lib/firestore.ts`.
- Ensure `npm run build && npm run lint` pass without errors.
- Ensure `npm test` runs successfully and new tests pass.
- Report follow-up items as comments in the PR, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
**Worker Prompt**

**Summary:**
This task involves adding comprehensive unit tests for the helper functions located in `src/lib/firestore.ts`. The tests should utilize Vitest and mock out Firebase SDK methods (e.g., `getFirestore`, `collection`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`) to ensure that only the logic within the helper functions themselves is being tested.

**Changed files list:**
- `src/lib/firestore.ts` (Potential minor refactoring for testability)
- `src/__tests__/lib/firestore.test.ts` (New file)

**Commands run and results:**
```bash
# Example commands, worker should execute and report actual results
npm install # if dependencies are out of sync
npm test    # should run the new tests and pass
npm run build && npm run lint # should pass without errors
```

**Known issues or limitations:**
- Assumes Vitest is already configured and listed as a dev dependency. If `npm test` fails due to Vitest not being set up, a minimal `vite.config.ts` modification may be necessary, but no new npm packages should be installed.

**Suggested next task:**
Add loading skeleton to nail item list (`src/App.tsx`)
```
