# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task contributes to the "2.4 Accessibility" goal by enhancing keyboard navigation and screen reader support.

## Objective

Add `aria-label` attributes to all icon-only buttons across the application.

## Allowed Scope

- `src/App.tsx`
- `src/components/**/*.tsx` (e.g., `src/components/NailItemCard.tsx`, `src/components/Header.tsx`, etc.)
- `src/App.css` (minor, if necessary, but unlikely)

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
- Prefer adding tests when touching `src/lib/` files (not applicable for this task).
- Report follow-up items as comments, not additional code.

## Worker prompt

Identify all button elements in the application that consist solely of an icon (e.g., SVG, icon font) without visible text, and add a descriptive `aria-label` attribute to them.

1.  **Scan for icon-only buttons**:
    *   Thoroughly check `src/App.tsx` and all components within `src/components/` for `<button>` elements.
    *   Focus on buttons that only contain an icon (like a `<svg>` element or an `<i>` tag with an icon class) and do not have visible text content or an existing `aria-label`.
2.  **Add `aria-label`**:
    *   For each identified icon-only button, add an `aria-label` attribute.
    *   The value of `aria-label` must be a concise and clear description of the button's action or purpose, as it would be read by a screen reader.
    *   **Examples**:
        *   A trash icon button for deleting an item: `<button aria-label="Delete item">...</button>`
        *   An edit icon button: `<button aria-label="Edit item">...</button>`
        *   A back arrow button: `<button aria-label="Go back">...</button>`
        *   A share icon button: `<button aria-label="Share item">...</button>`
        *   A sign-out icon button: `<button aria-label="Sign out">...</button>`
3.  **Ensure no visual changes**: The addition of `aria-label` should not introduce any visual changes to the UI.

### Acceptance Criteria

-   All icon-only buttons in the application (e.g., for CRUD actions, navigation, user actions like sign-out) have a meaningful `aria-label` attribute.
-   The `aria-label` accurately describes the button's function.
-   The user interface's visual appearance remains unchanged.
-   The application builds successfully, and linting passes without errors.

### Required Test Commands

```bash
npm run build
npm run lint
```
