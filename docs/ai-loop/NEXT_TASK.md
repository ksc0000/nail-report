# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task contributes to enhancing Accessibility (2.4) by ensuring interactive elements are properly labeled for screen readers.

## Objective

Add `aria-label` attributes to all icon-only buttons throughout the application to improve accessibility for users of assistive technologies.

## Allowed Scope

-   `src/components/` (modifying existing button components or usage)
-   `src/pages/` (modifying button usage in pages)
-   `src/App.css` (only if absolutely necessary for minor styling adjustments related to adding attributes)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Identify all `<button>` elements that contain only an icon (e.g., `<Button variant="icon">` or similar patterns) and do not have visible text.
-   Add a descriptive `aria-label` attribute to each identified button. The label should clearly explain the button's action (e.g., "Delete item", "Edit item", "Add new item", "Sign out").
-   Do not add `aria-label` to buttons that already have visible text content or an `aria-labelledby` attribute.
-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Prefer concise and accurate labels.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
