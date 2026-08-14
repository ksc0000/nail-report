```markdown
# Worker Prompt Template

## Context

The product roadmap indicates that Phase 2.1 is focused on improving test coverage. Vitest is the chosen test runner, and Firebase SDK mocking is expected.

## Objective

Implement Vitest unit tests for the helper functions located in `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability if necessary, but primarily tests *for* it)
- `src/__tests__/` (new test file: `src/__tests__/lib/firestore.test.ts`)
- `vite.config.ts` (if minor Vitest configuration adjustments are needed for mocking)

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
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

### Summary

Add unit tests for at least two key helper functions in `src/lib/firestore.ts` using Vitest. This involves creating a new test file `src/__tests__/lib/firestore.test.ts` and mocking Firebase Firestore interactions appropriately.

### Changed Files

- `src/__tests__/lib/firestore.test.ts` (new file)
- Potentially `src/lib/firestore.ts` (minor changes for testability)
- Potentially `vite.config.ts` (minor changes for Vitest mocking setup)

### Commands Run and Results

```bash
npm test
npm run build && npm run lint
```

Expected output: All tests pass, build succeeds, and lint produces no errors.

### Known Issues or Limitations

None anticipated. If `vitest` or `firebase/firestore` mocking setup proves challenging without modifying `package.json`, report as a limitation.

### Suggested Next Task

Add loading skeleton to the nail item list (`src/App.tsx`) to improve user experience during data fetching.
```
