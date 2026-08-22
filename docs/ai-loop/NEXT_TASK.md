```markdown
# Worker Prompt Template

## Context

The product roadmap focuses on improving stability, test coverage, and UX in Phase 2. This task specifically targets "2.1 Test coverage" by adding unit tests to critical helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `package.json` (to add `vitest` as a dev dependency if not already present, along with any necessary Vitest configuration in `vite.config.ts`)
- `vite.config.ts` (to configure Vitest)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new *runtime* npm packages without human approval; `vitest` as a `devDependency` is permitted for this task as it's part of the roadmap)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines. Focus on testing the primary CRUD operations (add, get, update, delete, list).
- If Vitest is not already configured or installed as a dev dependency, add it minimally to `package.json` and `vite.config.ts`.
- Mock Firebase SDK functions (`firebase/firestore`) appropriately using `vi.mock` to ensure true unit tests.
- Write tests that cover the successful execution paths for `addItem`, `getItem`, `updateItem`, `deleteItem`, and `listItems` (or similarly named functions) in `src/lib/firestore.ts`.
- Consider edge cases like an item not found for `getItem` or `updateItem`/`deleteItem`.
- Run `npm run build && npm run lint` before finishing.
- Run tests using `npm run test` (or `npx vitest`) and ensure they pass.

## Worker prompt

You are tasked with improving the test coverage of the `nail-report` application by adding unit tests for the core Firestore helper functions.

1.  **Verify Vitest Setup:**
    *   Check if `vitest` is already listed as a `devDependency` in `package.json`.
    *   Check if `vite.config.ts` has a `test` configuration block for Vitest.
    *   If Vitest is not set up, install it as a dev dependency (`npm install -D vitest`) and add a basic `test` configuration to `vite.config.ts`. Ensure `tsconfig.json` includes `vitest/globals` in `types`.

2.  **Create Test File:**
    *   Create a new test file: `src/__tests__/firestore.test.ts`.

3.  **Mock Firebase Firestore:**
    *   At the top of your test file, use `vi.mock('firebase/firestore');` to mock the Firebase Firestore SDK.
    *   Mock the specific functions used in `src/lib/firestore.ts` (e.g., `getDoc`, `addDoc`, `updateDoc`, `deleteDoc`, `query`, `getDocs`, `doc`, `collection`, `setDoc` if used for adding). Provide mock implementations that return expected values (e.g., a mock `DocumentSnapshot` for `getDoc`, or a mock `QuerySnapshot` for `getDocs`).

4.  **Implement Unit Tests for `src/lib/firestore.ts`:**
    *   Focus on the main CRUD operations: `addItem`, `getItem`, `updateItem`, `deleteItem`, and `listItems`.
    *   For each function, write at least one test case covering the successful scenario.
    *   Ensure your tests assert the correct behavior and interaction with the mocked Firebase functions.
    *   For `getItem`, `updateItem`, `deleteItem`, also add a test case for when the specified document does not exist.
    *   Keep the tests concise to adhere to the PR line limit.

5.  **Run Tests, Build, and Lint:**
    *   Execute your tests with `npm run test` (or `npx vitest`).
    *   Run `npm run build && npm run lint` to ensure no build or linting errors are introduced.

6.  **Review and Commit:**
    *   Ensure the diff is within the 150-line limit.
    *   Verify all requirements are met.

**Example `vite.config.ts` setup (if needed):**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom', // or 'node' if preferred for lib tests
    setupFiles: './src/setupTests.ts', // optional setup file
    mockReset: true, // resets mocks before each test
  },
});
```
**(Note: `src/setupTests.ts` is optional, remove if not needed. `environment: 'node'` might be better for pure lib tests.)**

```
```
