# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task targets the "Loading states" objective (2.3) by enhancing the user experience during data fetching.

## Objective

Implement a skeleton loading state for the nail item list within `src/App.tsx` or its directly related components. When the application is fetching the list of nail items, a placeholder skeleton UI should be displayed instead of an empty screen or an immediate list.

## Allowed Scope

-   `src/App.tsx`
-   `src/components/` (if a new component for the skeleton is created, or an existing list component is modified)
-   `src/App.css` (for styling the skeleton)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Keep diff ≤ 150 lines.
-   Display a simple placeholder/skeleton UI while the nail items are being fetched.
-   The skeleton should disappear and be replaced by the actual list once data is loaded.
-   No new npm dependencies are allowed.
-   Run `npm run build && npm run lint` before finishing.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

## Worker prompt

Jules, your task is to implement a loading skeleton for the nail item list.

1.  **Identify Data Fetching:** Locate where the nail item data is fetched in `src/App.tsx` or its immediate child components that render the list.
2.  **Manage Loading State:** Introduce or utilize an existing loading state variable (e.g., `isLoadingItems`) to track the data fetching status.
3.  **Implement Skeleton UI:**
    *   When `isLoadingItems` is `true`, render a simple visual placeholder (e.g., a few grey rectangles or lines) that mimics the general layout of a nail item in the list.
    *   When `isLoadingItems` is `false`, render the actual `NailItemList` component as usual.
4.  **Styling:** Add minimal CSS to `src/App.css` to style the skeleton elements. Focus on making them visually distinct but simple (e.g., `background-color: #f0f0f0; border-radius: 4px; height: 60px; margin-bottom: 8px;`).
5.  **Testing:** Manually verify that the skeleton appears on initial load (or slow network conditions) and disappears once data is fetched.
6.  **Cleanup:** Ensure no unnecessary code or commented-out sections remain.

**Acceptance Criteria:**

-   A loading skeleton is visibly displayed while nail item data is being fetched.
-   The skeleton is replaced by the actual list once data loading is complete.
-   The solution adheres to the diff size and forbidden scope constraints.

**Required Test Commands:**

```bash
npm run build
npm run lint
```
