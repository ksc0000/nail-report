```markdown
# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task specifically targets enhancing test coverage as outlined in section 2.1 of the roadmap.

## Objective

Implement unit tests for the Firebase Firestore helper functions located in `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes to export functions if needed for testing)
- `src/lib/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only if Vitest needs to be added to `devDependencies` and is not already present, though it's assumed to be part of the existing setup based on the roadmap. This is an exception to the "no new npm deps" constraint for *this specific package* if it's missing, as it's foundational for the testing phase.)
- `vite.config.ts` (if Vitest configuration is needed, e.g., for `vi.mock` setup or globals)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` (except for the specific case of adding Vitest if missing, and no other new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Focus on testing the core CRUD helper functions: `addNailItem`, `getNailItems`, `updateNailItem`, and `deleteNailItem`.
- Mock Firebase SDK dependencies using `vi.mock` as suggested in the roadmap (`Mocking Firebase SDK (vitest + vi.mock)`).
- Ensure new tests pass without introducing new warnings or errors.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---

# Worker prompt

## Task: Add Vitest unit tests for `src/lib/firestore.ts` helpers

### Detailed Instructions:

1.  **Verify Vitest Setup**: Confirm that Vitest is correctly configured in the project. Check `package.json` for `vitest` in `devDependencies` and `vite.config.ts` for any Vitest-related configuration. If `vitest` is missing from `devDependencies`, add it.
2.  **Create Test File**: Create a new file at `src/lib/__tests__/firestore.test.ts`.
3.  **Mock Firebase SDK**: In `src/lib/__tests__/firestore.test.ts`, use `vi.mock` to mock the `firebase/firestore` module and its relevant functions (e.g., `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`).
    *   Example: You might mock `getFirestore` to return a mock Firestore instance, and then mock the methods called on that instance.
4.  **Write Unit Tests**: Write unit tests for the following functions from `src/lib/firestore.ts`:
    *   `addNailItem`: Test successful addition of a nail item.
    *   `getNailItems`: Test successful retrieval of nail items for a given user.
    *   `updateNailItem`: Test successful update of an existing nail item.
    *   `deleteNailItem`: Test successful deletion of a nail item.
5.  **Focus on Success Paths**: Initially, focus on covering the primary success paths for these functions using mocked data. Error handling tests can be a follow-up task.
6.  **Run Tests**: Execute `npm run test` to verify the new tests pass.
7.  **Lint and Build**: Ensure `npm run lint` and `npm run build` pass without errors.

This task aims to establish a testing foundation for our Firestore interactions, improving the stability and maintainability of the application.
```
