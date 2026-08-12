# Worker Prompt Template

## Context

The `nail-report` application needs improved test coverage for its core Firebase helper functions to enhance stability and reliability. This task focuses on adding unit tests for the Firestore-related utilities.

## Objective

Implement unit tests for at least two core CRUD helper functions within `src/lib/firestore.ts` using Vitest, with appropriate mocking of Firebase SDK calls.

## Allowed Scope

- `src/lib/firestore.ts` (for inspection of functions to test)
- `src/__tests__/` (for creating new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (only if absolutely necessary for test setup, prefer to avoid)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two of the primary CRUD functions found in `src/lib/firestore.ts` (e.g., functions for adding, updating, deleting, or retrieving nail items).
- Utilize Vitest for testing.
- Implement mocking for Firebase SDK modules (`firebase/firestore`, `firebase/auth` if applicable) using `vi.mock()` to isolate the functions under test from actual Firebase service calls.
- Ensure the tests cover basic success cases for the chosen functions.
- Keep the diff size to approximately 150 lines or less. Prioritize depth for a few functions over shallow coverage of many, if hitting the line limit.
- Run `npm run build && npm run lint` successfully before marking the task complete.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
