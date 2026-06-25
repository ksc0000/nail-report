# Worker Prompt Template

## Context

The current focus is Phase 2 of the roadmap, which aims to improve stability, test coverage, and UX. This task specifically addresses accessibility improvements by ensuring interactive elements are properly labeled for assistive technologies.

## Objective

Add an `aria-label` attribute to all icon-only buttons throughout the application to improve accessibility.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/components/` (modifying existing component files)
- `src/views/` (modifying existing view files)
- `src/App.tsx`

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
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Worker prompt

### Task: Add `aria-label` to icon-only buttons

1.  **Identify Icon-Only Buttons**: Traverse the application's UI, focusing on components in `src/components/`, views in `src/views/`, and `src/App.tsx`. Look for `<button>` elements that contain only an icon (e.g., an SVG or an `<i>` tag with an icon class) and no visible text.
2.  **Add `aria-label` Attribute**: For each identified icon-only button, add an `aria-label` attribute.
    *   The value of `aria-label` must be a concise, descriptive text that explains the button's action to a screen reader user.
    *   **Examples**:
        *   A button with a trash can icon for deletion should have `aria-label="Delete item"`.
        *   A button with a pencil icon for editing should have `aria-label="Edit item"`.
        *   A button with an "X" icon for closing a dialog should have `aria-label="Close dialog"`.
        *   A button with an upload cloud icon for image upload should have `aria-label="Upload image"`.
        *   A button with a plus icon for adding a new item should have `aria-label="Add new item"`.
3.  **Do Not Modify Buttons With Visible Text**: Only add `aria-label` to buttons that *do not* have visible text content (i.e., they rely solely on an icon for their meaning). Buttons that already have descriptive text visible to all users do not need an `aria-label` (unless the visible text is insufficient, which is out of scope for this task).
4.  **No New Components or Styling**: This task is strictly about adding the `aria-label` attribute to existing elements. Do not create new components, change existing styling, or refactor component logic unless directly necessary for adding the attribute.

### Acceptance Criteria

- All icon-only buttons in the application have an appropriate `aria-label` attribute.
- The `aria-label` values accurately describe the button's function.
- No new npm packages are added.
- The diff is within the 150-line limit.

### Required test commands

```bash
npm run build
npm run lint
```
