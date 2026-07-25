# Worker Prompt Template

## Context

The product roadmap for `nail-report` outlines several phases. Phase 2 focuses on improving stability, test coverage, and UX, including accessibility. The current state indicates that the AI Loop is ready for its first substantive development task. This task will directly address an accessibility improvement by enhancing button semantics for screen readers.

## Objective

Identify all icon-only buttons within the application and add appropriate `aria-label` attributes to improve accessibility for users relying on screen readers.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/components/` (modifying existing components)
- `src/App.tsx` (modifying existing JSX for buttons)
- `src/lib/` (read-only, no modifications expected)
- `src/__tests__/` (no new tests expected for this task)
- `src/App.css` (no changes expected)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files (N/A for this task).
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---

## Worker Prompt

Implement the following:

1.  **Identify Icon-Only Buttons**: Go through the application's UI components, especially in `src/components/` and `src/App.tsx`, to find any `<button>` elements that contain only an icon (e.g., an SVG or an icon font) and no visible text.
2.  **Add `aria-label`**: For each identified icon-only button, add an `aria-label` attribute.
    *   The value of the `aria-label` should be a concise, descriptive string that explains the button's action or purpose to a screen reader user.
    *   For example:
        *   A delete button should get `aria-label="Delete item"`.
        *   An edit button should get `aria-label="Edit item"`.
        *   A close button in a modal should get `aria-label="Close dialog"`.
        *   A share button should get `aria-label="Share item"`.
3.  **Review and Test**:
    *   Ensure all `aria-label` values are accurate and helpful.
    *   Verify that adding these attributes does not negatively impact the visual layout or functionality.

**Acceptance Criteria:**

*   All icon-only buttons in the application's primary UI (e.g., item list, item details, tag management) have a meaningful `aria-label` attribute.
*   The `aria-label` accurately describes the button's action.
*   The application builds successfully without errors (`npm run build`).
*   The linter passes without warnings or errors (`npm run lint`).

**Required Test Commands:**

```bash
npm run build
npm run lint
```
