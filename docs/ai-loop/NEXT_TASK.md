# Worker Prompt Template

## Context

The AI Loop is progressing through Phase 2 of the roadmap, focusing on improving stability, test coverage, and UX. The current state indicates that the first substantive task is pending.

The previously suggested task of adding Vitest unit tests has been deferred due to the `no-new-npm-deps` constraint, as setting up Vitest would likely involve adding a new dependency. This task is a clear UI improvement that adheres to all current constraints.

## Objective

Implement a simple loading skeleton UI for the nail item list within the `src/App.tsx` component. This skeleton should be displayed while the nail items are being fetched from Firebase Firestore.

## Allowed Scope

-   `src/App.tsx` (main application component)
-   `src/App.css` (for styling the skeleton)
-   `src/components/` (if a new, small component is created for the skeleton, e.g., `src/components/NailItemSkeleton.tsx`)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Prefer adding tests when touching `src/lib/` files. (Not applicable to this task)
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

---

## Worker prompt

Implement a loading skeleton that appears in place of the nail item list when the data is being fetched.

1.  **Identify Loading State:** Determine the appropriate state variable in `src/App.tsx` that indicates whether nail items are currently loading. (e.g., `loading` or similar state used for data fetching).
2.  **Create Skeleton UI:**
    *   Either embed the skeleton directly in `src/App.tsx` or create a small, new component (e.g., `src/components/NailItemSkeleton.tsx`) to represent a single placeholder nail item.
    *   The skeleton should mimic the basic shape of a nail item entry (e.g., a few gray rectangles for image, title, and tags).
    *   Display a small number of these skeleton items (e.g., 3-5) when loading.
3.  **Conditional Rendering:** Use conditional rendering in `src/App.tsx` to display the skeleton when loading is true and the actual nail item list when data is loaded.
4.  **Styling:** Add minimal CSS to `src/App.css` to style the skeleton elements (e.g., `background-color`, `border-radius`, `height`, `width`). Avoid complex animations for this first pass.

**Acceptance Criteria:**

*   When the application is fetching nail items, a visual loading skeleton is displayed in the area where the list of nail items would normally appear.
*   The skeleton is replaced by the actual nail item list once the data has successfully loaded.
*   No new npm packages are added to `package.json`.
*   The implementation is concise and within the specified line limit.
*   `npm run build` and `npm run lint` pass without errors.
