```markdown
# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically targets Phase 2.4, enhancing accessibility. Many icon-only buttons in the application lack proper accessibility labels, making them difficult for screen reader users to understand.

## Objective

Add `aria-label` attributes to all icon-only buttons across the application to improve accessibility.

## Allowed Scope

- `src/components/` (modify existing component files)
- `src/App.tsx` (if it contains icon-only buttons directly)
- `src/features/` (if it contains icon-only buttons directly)
- `src/lib/` (read-only for context, but no modifications expected)
- `src/App.css` (minimal CSS adjustments if absolutely necessary, but not expected)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Adding new components, unless strictly necessary and very small. Prefer modifying existing ones.

## Requirements

- Keep diff ≤ 150 lines.
- For each icon-only button, add an `aria-label` attribute that clearly describes its action (e.g., "Delete item", "Edit tag", "Share report").
- Ensure that buttons that already have visible text labels (not just icons) do not receive redundant `aria-label`s, unless the visual label is insufficient. Focus primarily on buttons that are *only* icons.
- Run `npm run build && npm run lint` before finishing to ensure code quality and no build errors.
- Report any follow-up items or icon-only buttons that were missed in the comments of the PR, not by adding additional code.

## Worker prompt

Locate all instances of buttons that display only an icon and lack a visible text label. For each such button, add an `aria-label` attribute with a descriptive text reflecting the button's action.

For example:
If you find `<button onClick={handleDelete}><IconDelete /></button>`, change it to `<button onClick={handleDelete} aria-label="Delete item"><IconDelete /></button>`.

Prioritize common interactive elements such as delete, edit, add, share, close, or navigation buttons. Ensure the labels are concise and accurately convey the button's purpose.

### Acceptance Criteria

1.  All icon-only buttons in the application have a descriptive `aria-label` attribute.
2.  The application builds and lints without errors.
3.  The diff size is within the specified limit (≤ 150 lines).

### Required Test Commands

```bash
npm run build
npm run lint
```

### Example Files to Inspect

-   `src/components/NailItemCard/NailItemCard.tsx` (likely contains edit/delete buttons)
-   `src/components/TagManager/TagManager.tsx` (likely contains add/edit/delete tag buttons)
-   `src/App.tsx` or related layout components (if global actions exist)

```
