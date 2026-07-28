# Worker Prompt Template

## Context

The `nail-report` application is currently in Phase 2 of its roadmap, focusing on improving stability, test coverage, and user experience. This task specifically addresses Phase 2.4: Accessibility. The goal is to make the application more usable for individuals who rely on screen readers or other assistive technologies.

## Objective

Enhance accessibility by adding `aria-label` attributes to all interactive icon-only buttons across the application that currently lack a proper text alternative.

## Allowed Scope

-   `src/` (except `src/main.tsx`) - This will primarily involve modifying existing React component files (e.g., `src/components/**/*.tsx`).
-   `src/App.css` (if minor layout adjustments are needed to accommodate, but this is unlikely for `aria-label` changes).

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Identify all `button` elements that primarily consist of an icon (e.g., `<button><FaIcon /></button>`) and do not already have an `aria-label` or `title` attribute providing a clear, descriptive text alternative.
-   Add a descriptive `aria-label` attribute to each identified button. The `aria-label` content should clearly communicate the button's purpose to a screen reader user (e.g., "Delete item", "Edit item", "Add tag", "Sign out", "Open menu", "Upload image").
-   Prioritize existing UI text or visual cues when deriving the `aria-label`.
-   Keep diff ≤ 150 lines. Focus on a comprehensive pass for icon buttons.
-   Run `npm run build && npm run lint` before finishing.
-   No new npm dependencies are allowed.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
