# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on stability, test coverage, and UX. This task addresses the "2.3 Loading states" goal by improving the user experience during data fetching.

## Objective

Implement a simple loading skeleton for the main nail item list. The skeleton should appear while the list of nail items is being fetched from Firestore and disappear once the data is loaded and displayed.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/App.css` (for styling the skeleton)
- Existing components that render the nail item list.

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

Implement a loading skeleton component for the nail item list.

1.  **Identify the list component**: Locate the component responsible for rendering the list of `nailItems` (likely within `src/App.tsx` or a child component rendered by it).
2.  **Add a loading state check**: Integrate the skeleton display based on a loading state variable (e.g., `isLoadingItems` or `itemsLoading`). This state should be true while `nailItems` are being fetched and false once they are available.
3.  **Create a skeleton structure**: Design a simple visual skeleton using HTML and CSS that mimics the appearance of one or more nail item cards (e.g., grey rectangles for image, title, and tags). Consider creating a small, dedicated component for the skeleton if appropriate.
4.  **Styling**: Add necessary CSS to `src/App.css` or a component-specific CSS module for the skeleton's appearance.
5.  **Display logic**: When the loading state is true, render the skeleton. When the loading state is false and `nailItems` are available, render the actual list. If no items are found after loading, display the existing "no items" message.

### Acceptance Criteria:

-   A loading skeleton is displayed on the main screen when `nailItems` are being fetched.
-   The skeleton visually resembles the layout of actual nail item cards (e.g., a few grey placeholders).
-   The loading skeleton disappears, and the actual nail item list (or "no items" message) is displayed once fetching is complete.
-   No new npm packages are added or modified in `package.json`.
-   `npm run build` and `npm run lint` execute successfully without errors or warnings.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
