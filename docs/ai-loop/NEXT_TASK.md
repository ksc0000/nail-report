```markdown
# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses Phase 2.4 (Accessibility) by ensuring interactive elements are properly labeled for assistive technologies.

The current state indicates no substantive tasks have been completed from Phase 2 yet, making this a good foundational accessibility improvement.

## Objective

Enhance accessibility by adding `aria-label` attributes to all icon-only buttons across the application that currently lack descriptive text.

## Allowed Scope

-   `src/components/` (modify existing components to add `aria-label`)
-   `src/App.tsx` (if it contains icon buttons)
-   Any other `src/` file that renders icon-only buttons.

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Identify all buttons that contain only an icon and no visible text label.
-   Add a descriptive `aria-label` attribute to each identified icon-only button. The label should clearly convey the button's purpose to assistive technologies (e.g., "Delete item", "Edit tag", "Share nail report").
-   Keep the diff for this task at or below 150 lines.
-   Run `npm run build && npm run lint` before finishing to ensure code quality and build integrity.
-   Report any icon buttons that cannot be easily labeled or require more context as a comment in the PR.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
```
