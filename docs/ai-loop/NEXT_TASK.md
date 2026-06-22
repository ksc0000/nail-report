# Worker Prompt Template

## Context

The current phase is "2.0 Active", focusing on stability, test coverage, and UX. The roadmap includes improving accessibility. This task aims to address a specific accessibility improvement for icon-only buttons.

## Objective

Add `aria-label` attributes to all icon-only buttons throughout the application to improve accessibility for screen reader users.

## Allowed Scope

- `src/components/` (modifying existing components to add `aria-label`)
- `src/` (any other component file that contains icon-only buttons)
- `src/App.css` (if minor layout adjustments are needed due to attribute changes, though unlikely)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/lib/` files (not relevant for this task)
- `src/__tests__/` (not required for this UI-only change)

## Requirements

- Identify all buttons that contain only an icon (no visible text label).
- Add a descriptive `aria-label` attribute to each identified button. The label should clearly convey the button's purpose (e.g., "Delete item", "Edit item", "Add tag", "Sign out").
- Ensure `aria-label` values are user-friendly and concise.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

Implement the addition of `aria-label` attributes to all icon-only buttons in the `nail-report` application.

1.  **Identify Icon-Only Buttons:** Systematically go through components in `src/components/` and other relevant `src/` files to locate `<button>` elements that primarily use an icon (e.g., an SVG or an icon font) as their content and do not have a visible text label.
2.  **Add `aria-label`:** For each identified button, add an `aria-label` attribute with a concise, descriptive text that explains its function. For example:
    *   A trash can icon button to delete an item might get `aria-label="Delete nail item"`.
    *   A pencil icon button to edit an item might get `aria-label="Edit nail item"`.
    *   A plus icon button to add a new item might get `aria-label="Add new nail item"`.
    *   A share icon button might get `aria-label="Share item"`.
    *   A sign-out icon button might get `aria-label="Sign out"`.
3.  **Review and Test:** Manually review the application in a browser to ensure all relevant buttons have been updated. Consider using browser developer tools to inspect the accessibility tree (if available) or a screen reader extension to verify the `aria-label`s are correctly announced.
4.  **Lint and Build:** Run `npm run lint` and `npm run build` to ensure no errors or warnings are introduced.

**Example of change:**

```diff
--- a/src/components/SomeComponent.tsx
+++ b/src/components/SomeComponent.tsx
@@ -10,7 +10,7 @@
     return (
         <div>
             <button
-                onClick={handleDeleteItem}
+                onClick={handleDeleteItem} aria-label="Delete item"
                 className="icon-button"
             >
                 <TrashIcon />
```
