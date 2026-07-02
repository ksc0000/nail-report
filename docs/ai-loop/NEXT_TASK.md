# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task addresses a specific item under Phase 2.4, Accessibility, by ensuring icon-only buttons are properly labeled for screen readers.

## Objective

Identify all buttons in the application that display only an icon (without visible text) and add an appropriate `aria-label` attribute to each, providing a descriptive text equivalent for assistive technologies.

## Allowed Scope

-   `src/` (excluding `src/main.tsx`)
    -   This will primarily involve modifying existing React component files (`.tsx`) and potentially some global CSS if styling changes are needed (unlikely for this task).

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Locate all `button` elements that contain only an SVG icon or an `<img>` element without accompanying visible text.
-   For each identified button, add an `aria-label` attribute with a concise, descriptive text that explains the button's action (e.g., `aria-label="Delete item"`, `aria-label="Edit photo"`, `aria-label="Navigate back"`).
-   Ensure the `aria-label` is meaningful and consistent with the button's visual action.
-   Keep the overall line diff of the changes to ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing and confirm no errors or warnings.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
