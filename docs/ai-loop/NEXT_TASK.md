# Worker Prompt Template

## Context

The current phase is 2.0, focusing on improving stability, test coverage, and UX. This task addresses a specific item from Phase 2.4 (Accessibility) by enhancing keyboard navigation and screen reader support for interactive elements.

## Objective

Add `aria-label` attributes to all icon-only buttons throughout the application to improve accessibility.

## Allowed Scope

- `src/components/` (e.g., `src/components/NailItemCard.tsx`, `src/components/Header.tsx`, etc.)
- `src/pages/`
- Any other relevant `.tsx` files within `src/` that contain icon-only buttons.
- `src/App.css` (only if absolutely necessary for layout adjustments related to adding `aria-label`, but not expected).

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
- Prefer adding tests when touching `src/lib/` files. (Not applicable for this UI-focused task).
- Report follow-up items as comments, not additional code.

## Worker prompt

Your task is to identify all buttons in the application that consist solely of an icon (i.e., they don't have visible text content) and add a descriptive `aria-label` attribute to each of them. This label should convey the button's purpose to assistive technologies.

**Examples of icon-only buttons to target:**
*   Delete buttons
*   Edit buttons
*   Share buttons
*   Sorting/filtering buttons
*   Login/Logout buttons (if they are icon-only)
*   Any other navigational or action buttons represented only by an icon.

**Implementation details:**
1.  Navigate through the application's UI components and pages (e.g., `src/components`, `src/pages`).
2.  Locate `<button>` elements that contain only an icon (e.g., an SVG or a Font Awesome icon).
3.  Add an `aria-label="[descriptive text]"` attribute to these buttons.
    *   For example, a trash can icon button for deleting an item might get `aria-label="Delete item"`.
    *   A pencil icon button for editing might get `aria-label="Edit item"`.
    *   A sort icon might get `aria-label="Sort items"`.
4.  Ensure the `aria-label` is clear and concise, explaining the button's action.

## Acceptance Criteria

- All icon-only buttons throughout the application have a descriptive `aria-label` attribute.
- The application builds successfully and passes lint checks.

## Required Test Commands

```bash
npm run build
npm run lint
```
