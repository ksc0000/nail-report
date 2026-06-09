# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. No tasks have been completed in this phase yet. A key constraint is to not add any new npm dependencies.

## Objective

Implement a loading skeleton for the nail item list to improve the user experience during data fetching. This addresses Phase 2.3 "Loading states" from the product roadmap.

## Allowed Scope

-   `src/` (except `src/main.tsx`)
-   Specifically, `src/App.tsx` for rendering logic.
-   `src/App.css` for styling the skeleton.

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   When the nail item list data is being fetched from Firestore, display a simple loading skeleton.
-   The skeleton should consist of a few placeholder elements (e.g., div rectangles) that visually represent upcoming list items.
-   Once the data is loaded (or an error occurs), the skeleton should disappear, and the actual `NailItem` components should render.
-   The implementation should be contained within `src/App.tsx` and `src/App.css`.
-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
