```markdown
# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses the "2.4 Accessibility" goal by enhancing keyboard navigation and screen reader support. The application currently has icon-only buttons that lack proper labeling for assistive technologies.

## Objective

Identify and add an `aria-label` attribute to all icon-only buttons throughout the application to improve accessibility for screen reader users.

## Allowed Scope

- `src/**/*.tsx` (React components)
- `src/**/*.ts` (Helper files if component logic needs minor adjustment, though unlikely for this task)
- `src/App.css` (if any minor styling adjustments are incidentally needed, though unlikely)

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
- Prefer adding tests when touching `src/lib/` files (not applicable for this UI task).
- Report follow-up items as comments, not additional code.

## Worker prompt

Your task is to improve the accessibility of the `nail-report` application by adding `aria-label` attributes to all icon-only buttons.

1.  **Identify Icon-Only Buttons**: Systematically go through the application's UI, focusing on areas like:
    *   Nail item list (e.g., edit, delete buttons)
    *   Nail item detail view (e.g., edit, delete, back buttons)
    *   Tag management interface (e.g., add, edit, delete tag buttons)
    *   Image upload/management (e.g., delete image button)
    *   Navigation buttons (if any are icon-only)
    *   Any other interactive elements that are visually just icons but function as buttons.

2.  **Add `aria-label`**: For each identified button, add an `aria-label` attribute with a concise and descriptive text that explains the button's purpose.
    *   **Example**: Change `<button><TrashIcon /></button>` to `<button aria-label="Delete nail item"><TrashIcon /></button>`.
    *   The `aria-label` should accurately describe what action the button performs.

3.  **Review**: Ensure that no icon-only buttons are missed and that the `aria-label` texts are appropriate.

### Acceptance Criteria

- All `button` elements that display only an icon (or an image used as an icon) and lack visible text will have a meaningful `aria-label` attribute.
- The application remains fully functional and visually unchanged for sighted users.

### Required Test Commands

- `npm run build`
- `npm run lint`

### Example of a desired change:

```diff
--- a/src/components/NailItemCard.tsx
+++ b/src/components/NailItemCard.tsx
@@ -20,7 +20,7 @@
         <div className="flex space-x-2">
           <button
             onClick={() => onEdit(item)}
-            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
+            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
+            aria-label="Edit nail item"
           >
             <EditIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
           </button>
           <button
             onClick={() => onDelete(item.id)}
-            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
+            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
+            aria-label="Delete nail item"
           >
             <TrashIcon className="w-5 h-5 text-red-500" />
           </button>
```
```
