# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on stability, test coverage, and UX improvements. This includes accessibility enhancements.

## Objective

Identify all icon-only buttons within the application and add a descriptive `aria-label` attribute to each of them to improve accessibility for screen reader users.

## Allowed Scope

-   `src/components/` (most UI elements)
-   `src/pages/` (page-specific UI)
-   `src/App.tsx`
-   `src/App.css` (for minor styling adjustments related to accessibility, if necessary)
-   `src/` (any other UI-related files where icon-only buttons might exist, except `src/main.tsx`)

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
-   Identify all `button` elements that contain only an icon (e.g., `<img>`, `<svg>`, or an icon font character) and no visible text label.
-   Add an `aria-label="Descriptive Action"` attribute to each identified icon-only button, where "Descriptive Action" clearly communicates the button's purpose (e.g., "Delete item", "Edit profile", "Upload image").
-   Ensure existing functionality and visual layout are not adversely affected.
-   Prefer concise and accurate labels.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
