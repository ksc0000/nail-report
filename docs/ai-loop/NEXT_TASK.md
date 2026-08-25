```markdown
# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2 of its roadmap, focusing on stability, test coverage, and UX improvements. This task specifically targets Phase 2.4: Accessibility. The goal is to enhance the user experience for screen reader users by providing meaningful labels for interactive elements.

## Objective

Identify all icon-only buttons within the application and add appropriate `aria-label` attributes to them. This will make the purpose of these buttons clear to users relying on assistive technologies.

## Allowed Scope

-   `src/components/**/*.tsx`
-   `src/pages/**/*.tsx`
-   `src/App.tsx` (if it contains icon buttons)
-   `src/layouts/**/*.tsx`
-   Any `.tsx` file that renders a button.

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   **Identify icon-only buttons:** Scan all relevant `.tsx` files for `<button>` elements that primarily contain an icon (e.g., an SVG, an `<Icon>` component, or an `<img>` that serves as an icon) and lack visible text.
-   **Add `aria-label`:** For each identified icon-only button, add a descriptive `aria-label` attribute that clearly communicates the button's action or purpose. Examples: `aria-label="Delete item"`, `aria-label="Edit photo"`, `aria-label="Open menu"`, `aria-label="Close dialog"`.
-   **Clarity and Conciseness:** Ensure `aria-label` values are clear, concise, and accurately reflect the button's function.
-   **Small Diff:** The total line changes (additions + deletions) must be less than 150 lines.
-   **Build and Lint:** Run `npm run build && npm run lint` before finishing and ensure there are no errors or warnings.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

```
