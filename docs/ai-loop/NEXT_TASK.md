# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on stability, test coverage, and UX improvements. This task specifically addresses an accessibility improvement by adding semantic labels to interactive elements.

## Objective

Identify all icon-only buttons in the application and add an appropriate `aria-label` attribute to each of them. The `aria-label` should clearly describe the button's action for screen reader users.

## Allowed Scope

-   `src/components/` (modifying existing component files)
-   `src/App.tsx` (if icon-only buttons exist directly within App.tsx)
-   Any other `src/` file where icon-only buttons are rendered.

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Adding new UI elements or functionality beyond `aria-label` attributes.

## Requirements

-   Keep diff ≤ 150 lines.
-   Identify all instances of `<button>` elements that contain only an icon (e.g., `<button><SomeIcon /></button>`) and add an `aria-label="Descriptive text"` attribute.
-   Ensure the `aria-label` provides a concise and accurate description of the button's purpose (e.g., "Delete item", "Edit item", "Share link", "Close dialog", etc.).
-   Run `npm run build && npm run lint` before finishing.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
