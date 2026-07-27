# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on stability, test coverage, and UX improvements. This task specifically addresses Phase 2.4, enhancing accessibility for users.

## Objective

Add `aria-label` attributes to all icon-only buttons throughout the application to improve accessibility for screen reader users.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- Specifically, any `.tsx` or `.ts` files within `src/components/`, `src/pages/`, or other UI-related directories that render interactive icon-only buttons.
- `src/App.css` (for minor styling adjustments related to accessibility, if necessary, but unlikely for this task).

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
- Prefer adding tests when touching `src/lib/` files (not directly applicable to this UI-focused task).
- Report follow-up items as comments, not additional code.

## Worker prompt

Your task is to identify and modify all icon-only buttons in the application by adding a descriptive `aria-label` attribute.

1.  **Identify Icon-Only Buttons:** Scan through the application's React components (e.g., in `src/components/`, `src/pages/`) for `<button>` elements that contain only an icon (e.g., a React Feather icon like `FaPlus`, `FaEdit`, `FaTrash`, etc.) and do not have visible text.
2.  **Add `aria-label`:** For each identified icon-only button, add an `aria-label` attribute with a concise and clear description of the button's action.
    *   Example: If a button shows a plus icon and adds a new item, add `aria-label="Add new item"`.
    *   Example: If a button shows a trash icon and deletes an item, add `aria-label="Delete item"`.
    *   Ensure the `aria-label` accurately conveys the button's purpose to a screen reader user.
3.  **Verification:** After making changes, mentally (or by inspection) ensure that all primary interactive icon buttons have been addressed.

**Acceptance Criteria:**
- All icon-only buttons in the main application views (e.g., item list, item details, tag management) have an `aria-label` attribute.
- The `aria-label` accurately describes the button's function.

**Required test commands:**
```bash
npm run build
npm run lint
```
