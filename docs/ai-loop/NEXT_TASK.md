# Worker Prompt Template

## Context

The application needs improved test coverage, starting with core Firebase helper functions. This task focuses on adding unit tests for Firestore-related utilities.

## Objective

Implement unit tests for key helper functions in `src/lib/firestore.ts` using Vitest and mocked Firebase SDK.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments if necessary to improve testability, but the focus is on adding tests)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/App.css` (No changes expected, but allowed as per general scope)

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

Implement unit tests for the `firestore.ts` helper functions.

1.  Create a new test file `src/__tests__/firestore.test.ts`.
2.  Add tests for at least two core helper functions from `src/lib/firestore.ts`, such as `getNailItems` and `addNailItem`.
3.  Ensure the tests mock Firebase SDK dependencies using `vi.mock` from Vitest to isolate the functions under test from actual Firebase calls.
4.  Cover basic success cases for these functions. Consider adding simple error case tests if easily achievable within the line limit.

### Acceptance Criteria:
- A new file `src/__tests__/firestore.test.ts` exists.
- This file contains `vitest` unit tests.
- At least two functions from `src/lib/firestore.ts` (e.g., `getNailItems`, `addNailItem`) have basic success path tests implemented.
- Firebase SDK calls are mocked using `vi.mock` to prevent actual Firebase interactions during tests.

### Required Test Commands:
```bash
npm test
npm run build
npm run lint
```

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
