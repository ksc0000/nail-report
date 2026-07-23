# Worker Prompt Template

## Context

The `nail-report` application is currently in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task contributes to Phase 2.4, enhancing accessibility for users.

## Objective

Implement exactly one bounded task from Phase 2 of the roadmap: Add `aria-label` attributes to all icon-only buttons throughout the application to improve accessibility for screen reader users.

## Allowed Scope

-   `src/components/` (modify existing component files)
-   `src/pages/` (modify existing page files that contain icon buttons)
-   `src/App.css` (only if strictly necessary for layout, unlikely for this task)

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
-   Prefer adding tests when touching `src/lib/` files. (Not applicable for this task, as it's UI focused).
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

## Worker Prompt

Your task is to identify all icon-only buttons within the `nail-report` application's UI and add appropriate `aria-label` attributes to them. This will make the application more accessible to users relying on screen readers.

**Steps:**

1.  **Identify Icon-Only Buttons:** Navigate through the application's UI in development mode (`npm run dev`) and visually identify any button elements that consist solely of an icon (e.g., delete icons, edit pencils, share icons, back arrows, close buttons in modals, etc.) without accompanying visible text.
2.  **Locate Corresponding Code:** Find the React component files (`.tsx`) that render these icon-only buttons. Common locations will be `src/components/` and `src/pages/`.
3.  **Add `aria-label`:** For each identified icon-only button, add an `aria-label` attribute to the `<button>` HTML element. The `aria-label` should provide a concise, descriptive text alternative that explains the button's purpose to a screen reader.
    *   **Example:** For a trash can icon button that deletes an item, add `aria-label="Delete item"`.
    *   **Example:** For a pencil icon button that edits an item, add `aria-label="Edit item"`.
    *   **Example:** For a share icon button, add `aria-label="Share item"`.
    *   **Example:** For a close icon button in a modal, add `aria-label="Close dialog"`.
4.  **Review:** After making changes, run `npm run dev` and visually inspect the UI to ensure no regressions. While `aria-label` is not visible, it's good practice to ensure the UI still functions as expected.
5.  **Test:** Run `npm run build` and `npm run lint` to ensure no build errors or linting issues are introduced.

**Acceptance Criteria:**

-   All icon-only buttons throughout the application's UI have a meaningful `aria-label` attribute.
-   The application builds successfully (`npm run build`).
-   No linting errors are introduced (`npm run lint`).
-   The diff size is within the specified limit (≤150 lines).

**Required Test Commands:**

```bash
npm run build
npm run lint
```
