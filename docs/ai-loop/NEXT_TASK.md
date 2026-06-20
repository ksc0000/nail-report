# Worker Prompt Template

## Context

The product roadmap for `nail-report` is currently in Phase 2, focusing on improving stability, test coverage, and UX. Specifically, Phase 2.3 addresses "Loading states" by calling for a "Skeleton loading for the nail item list". The current application shows a blank screen while the nail item data is being fetched. Implementing a skeleton loader will improve the user experience by providing visual feedback during data loading.

## Objective

Implement a skeleton loading component that is displayed in the nail item list area while the `nailItems` data is being fetched.

## Allowed Scope

-   `src/components/` (for new skeleton components, e.g., `src/components/NailItemSkeleton.tsx`)
-   `src/App.tsx` (for integrating the skeleton loading state)
-   `src/App.css` or new `.module.css` files (for styling the skeleton)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Create a simple skeleton component that visually represents a loading nail item (e.g., placeholder shapes for image, title, tags).
-   Integrate this skeleton component into `src/App.tsx` so that it renders *conditionally* when the nail items data is being fetched (e.g., `isLoading` state is true) and is replaced by the actual nail item list once data is available.
-   Ensure the skeleton provides a smooth visual transition and matches the general layout of an actual nail item.
-   Keep the diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
