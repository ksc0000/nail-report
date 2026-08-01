```markdown
# Worker Prompt Template

## Context

The product roadmap indicates a focus on improving accessibility in Phase 2.4. This task addresses a specific accessibility improvement for interactive elements.

## Objective

Identify all icon-only buttons in the application and add appropriate `aria-label` attributes to them. The `aria-label` should clearly describe the button's action or purpose for screen reader users.

## Allowed Scope

- `src/components/` (e.g., `NailItem.tsx`, `Header.tsx`, `AuthStatus.tsx`, `TagManager.tsx`, `ShareDialog.tsx`)
- `src/App.tsx`
- `src/lib/` (if any utility functions related to UI rendering need adjustment, though unlikely for this task)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- For each `button` element that contains only an icon (e.g., an SVG or a Material Icon), add an `aria-label` attribute with a concise, descriptive text.
- Example: `<button><MaterialIcon icon="delete" /></button>` should become `<button aria-label="Delete nail item"><MaterialIcon icon="delete" /></button>`.
- Ensure the `aria-label` text is meaningful out of context.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to enhance the accessibility of the nail-report application by adding `aria-label` attributes to all icon-only buttons. This is a crucial step for users relying on screen readers.

1.  **Identify Icon-Only Buttons**: Go through the application's UI components (starting with `src/components/` and `src/App.tsx`) and locate all `<button>` elements that primarily use an icon (SVG, Material Icon, etc.) as their visual content, without accompanying text.
2.  **Add `aria-label`**: For each identified button, add an `aria-label` attribute. The value of this attribute should be a clear, human-readable description of the button's function.
    *   For example, a button showing a trash can icon for deleting an item might get `aria-label="Delete item"`.
    *   A button showing a plus icon to add something might get `aria-label="Add new item"`.
    *   A button with an "X" icon to close a dialog might get `aria-label="Close dialog"`.
3.  **Test**: After making changes, ensure the application still functions as expected.
4.  **Lint and Build**: Before completing the task, run `npm run build && npm run lint` to catch any compilation or style errors.

**Example Transformation:**

```diff
--- a/src/components/SomeComponent.tsx
+++ b/src/components/SomeComponent.tsx
@@ -10,7 +10,7 @@
     return (
         <div>
             <span>Hello</span>
-            <button onClick={handleDelete} className="icon-button">
+            <button onClick={handleDelete} className="icon-button" aria-label="Delete item">
                 <svg>...</svg> {/* A delete icon */}
             </button>
         </div>

```
