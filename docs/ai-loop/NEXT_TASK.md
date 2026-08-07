# Worker Prompt Template

## Context

The application needs improved test coverage for its core utility functions. Vitest is the chosen test runner, and Firebase SDK mocking will be required.

## Objective

Implement Vitest unit tests for the `addNailItem` and `getNailItems` helper functions within `src/lib/firestore.ts`. This task will involve mocking Firebase Firestore SDK calls to ensure isolated unit testing.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes for testability if strictly necessary)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (minor configuration if strictly necessary for mocking, but assume Vitest is already set up for basic usage)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- **Add Vitest unit tests** for `addNailItem` and `getNailItems` in `src/lib/firestore.ts`.
- Use `vi.mock` to mock Firebase Firestore SDK calls (e.g., `getFirestore`, `collection`, `addDoc`, `getDocs`, `query`, `orderBy`).
- Ensure tests cover successful operations and basic error scenarios if applicable to these functions.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---

# Worker Task Output (for Jules)

## Summary

Added Vitest unit tests for the `addNailItem` and `getNailItems` helper functions located in `src/lib/firestore.ts`. This involved creating a new test file and mocking Firebase Firestore SDK methods to allow for isolated testing.

## Changed files list

- `src/__tests__/firestore.test.ts` (new file)
- `src/lib/firestore.ts` (only if minor adjustments were needed for testability, otherwise none)

## Commands run and results

```bash
npm test
# Expected output: All tests pass for firestore.test.ts

npm run build
# Expected output: Build successful

npm run lint
# Expected output: No linting errors
```

## Known issues or limitations

- Error handling specific to Firebase SDK internals (e.g., network issues) might require more advanced mocking strategies not covered in this initial task.
- Only `addNailItem` and `getNailItems` functions were covered to keep the PR small.

## Suggested next task

Add Vitest + unit tests for `src/lib/auth.ts` helper functions (e.g., `signInWithGoogle`, `signOut`).
