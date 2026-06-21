# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task focuses on enhancing accessibility by adding `aria-label` attributes to icon-only buttons, as outlined in section 2.4 of the roadmap. This is a small, bounded task to incrementally improve the application's accessibility for screen reader users.

## Objective

Identify all icon-only buttons in the application and add appropriate `aria-label` attributes to improve accessibility.

## Allowed Scope

-   `src/` (except `src/main.tsx`) - specifically component files containing icon-only buttons.
-   `src/App.css` (only if absolutely necessary for layout adjustments related to labels, but this should be avoided as the task is purely semantic).

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
-   Prefer adding tests when touching `src/lib/` files (not applicable for this UI task).
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

## Worker prompt

1.  **Identify Icon-Only Buttons:** Traverse the `src/` directory to locate all HTML `<button>` elements that primarily use an icon (e.g., `<FaEdit />`, `<FaTrash />`, `<MdAdd />`) for their visual representation and do not have visible text labels.
2.  **Add `aria-label`:** For each identified icon-only button, add an `aria-label` attribute. The value of this attribute should be a concise, descriptive phrase that explains the button's action to screen reader users.
    *   Examples:
        *   An edit icon button should have `aria-label="Edit item"`.
        *   A delete icon button should have `aria-label="Delete item"`.
        *   An add icon button might have `aria-label="Add new item"` or `aria-label="Create new entry"`.
        *   A close or dismiss icon button should have `aria-label="Close"`.
3.  **Prioritize:** Start with commonly used components or those in the main UI views before moving to less frequently accessed parts of the application.
4.  **No Visual Changes:** Ensure that adding `aria-label` does not introduce any visual regressions or changes in functionality. It is purely an accessibility enhancement.
5.  **Adherence to Constraints:** Strictly adhere to the allowed scope, forbidden scope, and diff size limits.

**Acceptance Criteria:**

*   All identified icon-only buttons in the application have an `aria-label` attribute.
*   The `aria-label` values accurately describe the button's purpose.
*   No new npm packages have been added.
*   No visual changes or functional regressions have been introduced.

**Required Test Commands:**

```bash
npm run build
npm run lint
```
