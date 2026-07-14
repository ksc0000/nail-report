# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task addresses the "Loading states" sub-phase (2.3) by providing visual feedback during data fetching.

## Objective

Implement a skeleton loading component for the nail item list in `src/App.tsx` to indicate that nail items are being fetched from the database.

## Allowed Scope

-   `src/App.tsx`
-   `src/App.css` (for styling the skeleton)
-   `src/components/` (if a new skeleton component is created)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Identify the state in `src/App.tsx` that indicates `nailItems` are currently being loaded. If such a state does not exist, introduce a simple `isLoading` boolean state.
-   When `isLoading` (or equivalent) is true, render a basic skeleton UI that visually represents 2-3 nail item cards in the main list area.
-   When `isLoading` (or equivalent) is false and `nailItems` are available, render the actual nail item list as currently implemented.
-   The skeleton should be purely visual and not interactive.
-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Do not add any new npm dependencies to `package.json`.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
