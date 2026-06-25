# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses the accessibility goal within Phase 2.4 by enhancing keyboard navigation and screen reader support.

## Objective

Add `aria-label` attributes to all icon-only buttons in the application to improve accessibility for users relying on screen readers or keyboard navigation.

## Allowed Scope

-   `src/` (except `src/main.tsx`)
-   `src/components/` (modifying existing components to add `aria-label`)
-   `src/App.tsx` (if it contains icon buttons directly)
-   `src/App.css` (no changes expected for this task)

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
-   Prefer adding tests when touching `src/lib/` files (not applicable for this UI-focused task).
-   Report follow-up items as comments, not additional code.

## Worker Prompt

Implement the following steps:

1.  **Identify Icon-Only Buttons:** Traverse the application's UI components and identify all `<button>` elements that only contain an icon (e.g., using a library icon component or an `<img>` tag) and do not have visible text.
2.  **Determine Appropriate `aria-label`:** For each identified button, determine a concise and descriptive `aria-label` value that clearly communicates the button's purpose to a screen reader user (e.g., "Delete item", "Edit item", "Add new tag").
3.  **Add `aria-label` Attribute:** Add the determined `aria-label` attribute to each identified icon-only button element.
4.  **Verify Accessibility (Manual):**
    *   Visually inspect the UI to ensure no unexpected changes occurred.
    *   (Optional but recommended) Test basic keyboard navigation to confirm buttons are focusable and clickable using `Enter` or `Space`.
    *   (Optional but recommended) Use browser developer tools (e.g., Chrome Lighthouse or Accessibility Tree in Firefox/Chrome) to verify the `aria-label` is correctly exposed.

## Acceptance Criteria

-   All icon-only buttons within the application now have a descriptive `aria-label` attribute.
-   The application builds successfully (`npm run build`).
-   The linter passes without errors (`npm run lint`).

## Required Test Commands

```bash
npm run build
npm run lint
```
