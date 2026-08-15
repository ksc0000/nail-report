# Worker Prompt

## Context

The current phase focuses on improving stability and test coverage. This task initiates unit testing for Firebase helper functions, starting with Firestore operations, as outlined in the roadmap under "2.1 Test coverage".

## Objective

Add Vitest unit tests for key helper functions within `src/lib/firestore.ts`, specifically focusing on `addNailItem` and `getNailItems`.

## Allowed Scope

-   `src/lib/firestore.ts` (minor modifications for export/mocking if necessary)
-   `src/__tests__/firestore.test.ts` (new file)
-   `vite.config.ts` (if Vitest setup for mocking Firebase is incomplete)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   `src/App.css`

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Prefer adding tests when touching `src/lib/` files.
-   Report follow-up items as comments, not additional code.

## Worker prompt

Your task is to implement unit tests for the `addNailItem` and `getNailItems` functions located in `src/lib/firestore.ts` using Vitest.

1.  **Ensure Vitest Configuration for Firebase Mocking:**
    *   Verify that `vite.config.ts` is configured to allow mocking of Firebase SDK modules. If not, add the necessary setup (e.g., `test.globals` or alias configurations) to support `vi.mock('firebase/firestore')`.

2.  **Create Test File:**
    *   Create a new test file: `src/__tests__/firestore.test.ts`.

3.  **Mock Firebase Firestore SDK:**
    *   Inside `src/__tests__/firestore.test.ts`, use `vi.mock('firebase/firestore')` to mock the necessary Firestore functions like `collection`, `addDoc`, `query`, `getDocs`, `doc`, `where`, etc.
    *   The mocks should simulate the behavior of these functions without actually interacting with a live Firebase instance. For `getDocs`, ensure it returns a mock `QuerySnapshot` with mock `QueryDocumentSnapshot` items when called. For `addDoc`, ensure it simulates adding a document and returns a mock `DocumentReference`.

4.  **Write Tests for `addNailItem`:**
    *   Add a test suite for `addNailItem` that verifies:
        *   It calls `addDoc` with the correct `collection` reference and data.
        *   It handles successful addition (e.g., returns a document ID or success status).
        *   Consider a basic error case (e.g., if `addDoc` throws an error).

5.  **Write Tests for `getNailItems`:**
    *   Add a test suite for `getNailItems` that verifies:
        *   It calls `collection` and `query` with the correct arguments (e.g., collection name, user ID, sorting).
        *   It calls `getDocs` and correctly processes the returned mock snapshot into an array of `NailItem` objects.
        *   Ensure the data transformation from Firestore document to application `NailItem` format is tested (e.g., `doc.id` is correctly mapped).
        *   Consider a basic error case (e.g., if `getDocs` throws an error).

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
