# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses item 2.4, "Accessibility," by enhancing the usability of icon-only buttons for screen reader users.

## Objective

Identify all icon-only buttons throughout the application and add appropriate `aria-label` attributes to them, providing a descriptive text equivalent for their action.

## Allowed Scope

-   `src/components/` (e.g., button components, UI elements)
-   `src/App.tsx` (if top-level buttons exist)
-   Any other `src/` file where icon-only buttons are used (excluding `src/main.tsx`).
-   `src/App.css` (only if minor styling adjustments are required to support `aria-label`, but unlikely).

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Identify all `button` elements that contain only an icon (e.g., an SVG or an icon font) and no visible text.
-   Add an `aria-label` attribute to each identified button.
-   The `aria-label` text should clearly describe the button's action or purpose (e.g., `aria-label="Delete item"`, `aria-label="Edit item"`, `aria-label="Close dialog"`).
-   Ensure the diff remains ≤ 150 lines.
-   Run `npm run build && npm run lint` successfully before finishing the task.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

## Suggested next task

Add loading skeleton to nail item list (`src/App.tsx`) to improve the user experience during data fetching, as outlined in Phase 2.3 of the roadmap.
