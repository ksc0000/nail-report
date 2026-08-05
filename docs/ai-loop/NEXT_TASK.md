# Worker Prompt Template

## Context

The `nail-report` application needs to improve its user experience by showing clear loading states. This task focuses on implementing a skeleton loading UI for the main list of nail items.

## Objective

Implement a skeleton loading component for the nail item list in `src/App.tsx` that displays while the nail items are being fetched.

## Allowed Scope

- `src/App.tsx`
- `src/components/` (for a new skeleton component, if needed)
- `src/App.css` (for styling the skeleton)
- `src/types/` (if new types are strictly necessary for the component)

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

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

Implement a skeleton loading state for the nail item list displayed in `src/App.tsx`.

1.  **Identify Loading State:** Determine the appropriate state variable in `src/App.tsx` that indicates whether `nailItems` are currently being fetched (e.g., initial load, refresh). If a suitable loading state does not exist, introduce one (e.g., `isLoadingItems`).
2.  **Create Skeleton UI:**
    *   When the loading state is active, render a placeholder skeleton UI instead of the actual `NailItem` list.
    *   The skeleton should visually resemble a few (e.g., 3-5) individual `NailItem` components, showing their general shape (e.g., a placeholder image, title, and tags area).
    *   You may create a new lightweight component (e.g., `NailItemSkeleton.tsx`) in `src/components/` to represent a single skeleton item, and render multiple instances of it.
3.  **Integrate into App.tsx:** Modify the render logic in `src/App.tsx` to conditionally display either the skeleton UI or the actual `NailItem` list based on the loading state.
4.  **Styling:** Add basic CSS in `src/App.css` or the component's CSS for the skeleton's appearance (e.g., grey backgrounds, animation for shimmer effect).

**Acceptance Criteria:**

*   When the application is fetching nail items, a visual skeleton loading state is clearly visible where the list of items would normally be.
*   Once nail items are loaded, the skeleton disappears, and the actual list is rendered.
*   The skeleton UI provides a smooth visual transition and hint about the incoming content structure.
*   No new npm packages are added or modified in `package.json`.

**Required Test Commands:**

```bash
npm run build
npm run lint
```
