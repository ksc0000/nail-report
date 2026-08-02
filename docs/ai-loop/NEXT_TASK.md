# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses an item under Phase 2.4: Accessibility.

## Objective

Enhance accessibility by identifying all icon-only buttons within the application and adding a descriptive `aria-label` attribute to each.

## Allowed Scope

-   `src/` (except `src/main.tsx`)
-   `src/App.css` (for minor styling adjustments if necessary, though unlikely for this task)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Identify all `button` elements that contain only an icon (e.g., `<button><IconComponent /></button>`) and no visible text.
-   Add a semantic and user-friendly `aria-label` attribute to each identified icon-only button. The `aria-label` should clearly describe the button's action or purpose (e.g., `aria-label="Delete nail item"`, `aria-label="Edit tag"`, `aria-label="Upload image"`).
-   Ensure that existing functionality and styling are not negatively impacted.
-   Keep the total line diff for the PR ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing to ensure code quality and prevent build errors.
-   Prefer small, incremental changes. If the number of icon buttons is very large, select a subset that fits within the line limit.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
