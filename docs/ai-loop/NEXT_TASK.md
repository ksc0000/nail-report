# Worker Prompt Template

## Context

The nail-report application aims to improve its accessibility for users relying on assistive technologies. Icon-only buttons currently lack proper semantic descriptions, which can hinder navigation and understanding for these users. This task addresses Phase 2.4 of the roadmap, focusing on core accessibility improvements.

## Objective

Identify all icon-only buttons in the application and add an appropriate `aria-label` attribute to each of them, providing a clear and concise description of the button's action or purpose.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/` helpers (firestore.ts, storage.ts, auth.ts, publicShares.ts) - *Unlikely to be modified for this task, but allowed for completeness.*
- `src/__tests__/` (new test files) - *Unlikely to be modified for this task, as it's a UI attribute addition.*
- `src/App.css` (CSS improvements) - *Unlikely to be modified for this task.*

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

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---

## Worker Prompt

Your task is to enhance the accessibility of the nail-report application by adding `aria-label` attributes to all icon-only buttons.

1.  **Identify Icon-Only Buttons:** Systematically go through the React components in `src/` and locate all `<button>` elements that primarily use an icon for their visual representation and do not have visible text.
2.  **Add `aria-label`:** For each identified button, add an `aria-label` attribute. The value of this attribute should be a concise, descriptive string that explains the button's function (e.g., "Delete item", "Edit tag", "Upload image", "Share").
3.  **Review and Test:** Ensure that the added `aria-label`s accurately reflect the button's purpose.

**Example:**

```diff
 // Before
 <button className="icon-button" onClick={handleDelete}>
-  <DeleteIcon />
+  <DeleteIcon aria-hidden="true" />
 </button>

 // After
 <button className="icon-button" onClick={handleDelete} aria-label="Delete item">
-  <DeleteIcon />
+  <DeleteIcon aria-hidden="true" />
 </button>
```

(Note: You might also add `aria-hidden="true"` to the icon itself if it's purely decorative and its meaning is conveyed by the `aria-label` on the button.)
