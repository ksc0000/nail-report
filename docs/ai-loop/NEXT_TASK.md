```markdown
# Worker Prompt Template

## Context

The current phase (Phase 2) focuses on improving stability, test coverage, and UX. This task addresses "2.1 Test coverage" by adding unit tests for a critical `src/lib/` helper file.

## Objective

Implement comprehensive unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications only if necessary for testability, e.g., exporting unexported functions, but prefer not to alter functionality)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (minor additions if Vitest setup is incomplete for `src/lib` testing, but Vitest should already be integrated)

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

## Worker prompt

### Summary of what changed

Add unit tests for the core Firestore helper functions located in `src/lib/firestore.ts`.

### Changed files list

- `src/__tests__/firestore.test.ts` (new file)
- Potentially `src/lib/firestore.ts` (for minor testability adjustments like exporting internal functions if needed, but avoid changing logic)

### Commands run and results

```bash
npm install # Ensure dependencies are up-to-date
npm test -- src/__tests__/firestore.test.ts # Run only the new tests
npm run build # Verify build
npm run lint # Verify linting
```

Expected output:
- `npm test` should pass all new tests without errors.
- `npm run build` should complete successfully.
- `npm run lint` should report no errors.

### Known issues or limitations

N/A

### Suggested next task

Add Vitest + unit tests for `src/lib/storage.ts` helpers
```
