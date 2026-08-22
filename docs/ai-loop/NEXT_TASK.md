# Worker Prompt Template

## Context

The application needs to improve its user experience by providing visual feedback during data loading. Specifically, when the list of nail items is being fetched from the backend, the current UI might appear blank or abruptly populated, which can be jarring for users. Implementing a loading skeleton will create a smoother and more professional feel.

## Objective

Implement a simple loading skeleton component to be displayed while the nail item list is being fetched. The skeleton should visually represent the layout of the actual nail items, indicating that content is on its way.

## Allowed Scope

-   `src/App.tsx` (to integrate the skeleton)
-   `src/components/` (to create a new component for the skeleton if necessary)
-   `src/App.css` or new CSS modules within `src/` (for styling the skeleton)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Create a new React component (e.g., `NailItemListSkeleton.tsx`) or modify `App.tsx` directly to render the skeleton.
-   Display the loading skeleton in `src/App.tsx` when the application is in a loading state for nail items.
-   The skeleton should consist of placeholder shapes (e.g., rectangles) that mimic the layout of actual nail item cards (e.g., image, title, tags).
-   Ensure the skeleton disappears, and the actual nail item list renders once the data has finished loading.
-   Keep the diff for this task ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Do not add any new npm packages.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
