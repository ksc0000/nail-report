# Worker Prompt Template

## Context

The `nail-report` application is currently in Phase 2 of its roadmap, focusing on improving stability, test coverage, and user experience. A key area for improvement is accessibility. This task specifically addresses a point from Phase 2.4 Accessibility.

## Objective

Enhance the accessibility of the application by identifying all icon-only buttons and adding an appropriate `aria-label` attribute to each of them. This will provide context for screen reader users regarding the button's purpose.

## Allowed Scope

-   `src/components/` (modifying existing component `.tsx` files)
-   `src/features/` (modifying existing feature component `.tsx` files)
-   `src/App.tsx` (if icon buttons are present here)
-   `src/App.css` (for minor styling adjustments if needed, though unlikely for this task)
-   Any other `.tsx` files within `src/` that contain icon-only buttons.

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
-   Identify all instances of buttons that contain only an icon (e.g., `<button><Icon /></button>`) and add an `aria-label="[descriptive text]"` attribute.
-   The `aria-label` should clearly describe the button's action (e.g., "Delete item", "Edit profile", "Share link").
-   Ensure no existing `aria-label` attributes are duplicated or incorrectly modified.
-   No new components or significant UI changes are expected beyond adding the `aria-label` attributes.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

---

**Worker prompt:**

Please proceed with implementing the task described above. Focus on thoroughly identifying all icon-only buttons across the application's UI and adding meaningful `aria-label` attributes to them. Once done, ensure the application builds and passes lint checks.
