```markdown
# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on stability, test coverage, and UX improvements. This task specifically addresses "2.4 Accessibility" by improving the usability for assistive technologies.

## Objective

Enhance the accessibility of the `nail-report` application by adding `aria-label` attributes to all icon-only buttons that lack visible text.

## Allowed Scope

-   `src/components/` (modifying existing React components)
-   Any other `.tsx` file within `src/` (except `src/main.tsx`) where icon-only buttons are rendered.
-   `src/App.css` (minor adjustments if absolutely necessary for layout, but unlikely for this task)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Identify all `<button>` elements that contain only an icon (e.g., SVG, `react-icons` component) and no visible text content.
-   Add a descriptive `aria-label` attribute to each identified button. The label should clearly explain the button's action (e.g., `aria-label="Edit item"`, `aria-label="Delete item"`, `aria-label="Upload image"`, `aria-label="Sign out"`).
-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Prefer adding tests when touching `src/lib/` files. (Not applicable to this task as `src/lib/` files are unlikely to contain UI buttons).
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
```
