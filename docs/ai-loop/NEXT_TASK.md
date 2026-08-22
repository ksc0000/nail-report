# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task.

## Objective

Implement a skeleton loading UI for the nail item list while data is being fetched.

## Allowed Scope

- `src/App.tsx`
- `src/components/` (for a new loading skeleton component if needed)
- `src/App.css` or component-specific CSS files within `src/`
- `src/types/` (if new types are strictly necessary, though unlikely for this task)

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

The application currently shows a blank screen or an empty list before nail items are loaded from Firebase Firestore. To improve user experience, add a loading skeleton that appears while the data is being fetched.

**Detailed Steps:**

1.  **Identify Loading State**: In `src/App.tsx`, determine the appropriate place where the nail item list is rendered and where the loading state for fetching these items can be accessed or introduced. You might need to add a local state variable (e.g., `isLoadingItems`) or hook into an existing data fetching mechanism.
2.  **Create Skeleton UI**: Implement a simple, visually distinct skeleton UI. This can be done by:
    *   Adding conditional rendering logic in `src/App.tsx` to display the skeleton when `isLoadingItems` is true.
    *   Optionally, create a new, small React component (e.g., `src/components/NailItemSkeleton.tsx`) that renders the skeleton structure (e.g., a few `div` elements with background colors or shimmer effects).
3.  **Apply Styles**: Add necessary CSS to `src/App.css` or a new component-specific CSS file to style the skeleton, making it resemble the layout of a single nail item but clearly indicating it's a placeholder.
4.  **Integrate**: Ensure the skeleton is shown only when data is loading and automatically replaced by the actual list of nail items once the data has successfully loaded.

**Acceptance Criteria:**

*   A visual loading skeleton replaces the nail item list when the application is fetching items from Firestore.
*   The skeleton provides a clear visual indication that content is loading.
*   Once nail items are loaded, the skeleton disappears, and the actual list of nail items is displayed.
*   No new npm packages are added to `package.json`.
*   The diff size is kept under 150 lines.
*   `npm run build` and `npm run lint` pass without errors.

---
## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
