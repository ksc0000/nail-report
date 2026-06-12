# Worker Prompt Template

## Context

The current focus is Phase 2 of the roadmap, which aims to improve stability, test coverage, and UX. This task specifically addresses accessibility improvements by ensuring interactive elements are properly labeled for assistive technologies.

## Objective

Enhance accessibility by adding `aria-label` attributes to all icon-only buttons throughout the application.

## Allowed Scope

-   `src/components/**/*.tsx` (or any other `src/**/*.tsx` file containing button components)
-   `src/App.css` (for minor styling adjustments if necessary, but unlikely for this task)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Identify all buttons that contain only an icon and no visible text label.
-   Add an appropriate `aria-label` attribute to each identified button, providing a concise, descriptive name for its function (e.g., `aria-label="Delete item"`, `aria-label="Edit tag"`).
-   Ensure the `aria-label` accurately reflects the button's action.
-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

---

**Acceptance Criteria:**

*   All icon-only buttons in the application have a descriptive `aria-label` attribute.
*   The application builds successfully (`npm run build`).
*   The linter passes (`npm run lint`).

**Required Test Commands:**

```bash
npm install
npm run build
npm run lint
```
