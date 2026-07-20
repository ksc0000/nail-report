# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, which focuses on improving stability, test coverage, and UX. This task contributes to the Accessibility (2.4) goal by enhancing the usability for assistive technologies.

## Objective

Identify all icon-only buttons in the application and add appropriate `aria-label` attributes to them to improve accessibility.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/components/` (modifying existing components to add `aria-label`)
- `src/App.css` (if minor style adjustments are needed for layout stability after changes)

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
- Ensure all interactive icon-only elements that function as buttons have a descriptive `aria-label`.
- The `aria-label` should clearly describe the button's action (e.g., "Delete item", "Edit profile", "Share link").

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---

## Worker prompt

You are Jules, an AI code assistant. Your current task is to enhance the accessibility of the nail-report application by adding `aria-label` attributes to all icon-only buttons.

1.  **Identify Icon-Only Buttons:**
    *   Scan the `src/` directory for components or JSX elements that render buttons containing only icons (e.g., `<button><IconComponent /></button>`). Look for common UI patterns like edit, delete, add, close, navigation, or share buttons.
2.  **Add `aria-label`:**
    *   For each identified icon-only button, add an `aria-label` attribute with a descriptive text that conveys the button's purpose to screen reader users.
    *   Example: If a button shows a trash can icon and its function is to delete an item, add `aria-label="Delete item"`.
    *   Ensure the `aria-label` is localized if the app supports multiple languages (for now, use clear English descriptions).
3.  **Test and Verify:**
    *   Visually inspect the application to ensure the changes haven't introduced any layout regressions.
    *   Run `npm run build && npm run lint` to ensure code quality and prevent build issues.

**Example of a change:**

```diff
--- a/src/components/SomeComponent.tsx
+++ b/src/components/SomeComponent.tsx
@@ -X,X +X,X @@
 import { TrashIcon } from '@heroicons/react/24/outline';
 
 function SomeComponent() {
   return (
     <div>
-      <button onClick={() => handleDelete()} className="icon-button">
+      <button onClick={() => handleDelete()} className="icon-button" aria-label="Delete item">
         <TrashIcon className="h-5 w-5" />
       </button>
     </div>
   );
 }
```
