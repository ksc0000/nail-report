# Worker Prompt Template

## Context

The application needs accessibility improvements. Specifically, icon-only buttons lack proper labels for screen readers.

## Objective

Identify all icon-only buttons in the application and add appropriate `aria-label` attributes to them, ensuring they are accessible to users relying on screen readers.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/components/` (modifying existing component files)
- Any `.tsx` files containing icon buttons that need `aria-label`s.
- `src/App.css` (only if absolutely necessary for layout adjustments related to buttons, but unlikely for this task)

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

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

1.  **Identify Icon-Only Buttons:** Scan the `src/` directory, focusing on `src/components/` and `src/App.tsx`, to find all instances of `<button>` elements that contain only an icon (e.g., using an SVG or an icon font) without visible text.
2.  **Add `aria-label`:** For each identified icon-only button, add an `aria-label` attribute that clearly describes its action. For example, a delete button might get `aria-label="Delete item"`.
3.  **Ensure Semantic Correctness:** Verify that the `aria-label` accurately conveys the button's purpose.
4.  **Lint and Build:** Run `npm run build` and `npm run lint` to ensure no new errors or warnings are introduced.

**Example of a change:**

```diff
--- a/src/components/SomeComponent.tsx
+++ b/src/components/SomeComponent.tsx
@@ -X,X +X,X @@
 <button
-  onClick={handleDelete}
+  onClick={handleDelete}
+  aria-label="Delete item"
 >
   <TrashIcon />
 </button>
```
