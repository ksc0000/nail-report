# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task addresses the "2.1 Test coverage" goal by adding unit tests to critical helper functions.

## Objective

Implement Vitest unit tests for the core Firebase Firestore helper functions related to `nailItems` in `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing, if necessary)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (if minor Vitest configuration is needed, e.g., for `globals`)

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

Create a new test file `src/__tests__/firestore.test.ts`.

Implement unit tests for the core CRUD functions related to `nailItems` found in `src/lib/firestore.ts`. This includes functions such as `addNailItem`, `getNailItems`, `updateNailItem`, and `deleteNailItem`.

You must mock the Firebase Firestore SDK using `vi.mock('firebase/firestore')` to ensure that the tests are isolated and do not interact with actual Firebase services. Focus on testing the logic within `src/lib/firestore.ts` and the correct invocation of Firebase SDK methods.

Aim for reasonable coverage of the successful execution paths for these functions. Consider basic error path scenarios if they can be straightforwardly mocked (e.g., simulating a Firestore write failure).

**Acceptance Criteria:**
- A new file `src/__tests__/firestore.test.ts` is created.
- `firestore.test.ts` contains unit tests for `addNailItem`, `getNailItems`, `updateNailItem`, and `deleteNailItem` (or similarly named `nailItem` CRUD functions).
- Firebase Firestore SDK is mocked using `vi.mock`.
- Tests pass when `npm run test` is executed.

**Required Test Commands:**
```bash
npm install # Ensure dependencies are up-to-date
npm run test # Run the newly added unit tests
npm run build && npm run lint # Verify build and linting
```

**Suggested next task:**
Add Vitest + unit tests for `src/lib/storage.ts` helpers.
