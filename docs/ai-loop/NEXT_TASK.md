# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on stability, test coverage, and UX. Specifically, Phase 2.4 aims to improve accessibility. This task directly addresses an item in this phase by enhancing keyboard navigation and screen reader support.

## Objective

Implement `aria-label` attributes for all icon-only buttons in the application to improve accessibility for screen reader users.

## Allowed Scope

- `src/` (excluding `src/main.tsx`)
- Specifically, component files (`.tsx`, `.jsx`) where buttons are defined.
- `src/App.css` (only if minor styling adjustments are needed to accommodate accessibility changes, which is unlikely for this task).

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
- For each identified icon-only button, add an `aria-label` attribute.
- The `aria-label` text must be descriptive of the button's action (e.g., "Delete item", "Edit nail report", "Upload image", "Sign out").
- Do not add `aria-label` to buttons that already have a visible text label.
- Focus on interactive buttons rather than decorative elements.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

Your task is to identify all buttons in the `src/` directory that solely consist of an icon (e.g., `FontAwesomeIcon`) without any accompanying visible text label. For each of these buttons, add an `aria-label` attribute.

**Detailed Steps:**

1.  **Scan `src/` files:** Look for `<button>` elements that primarily contain an icon component (like `<FontAwesomeIcon />`) but no other text content.
2.  **Add `aria-label`:** For each identified icon-only button, add an `aria-label` attribute. The value of this attribute should clearly describe the button's function.
    *   **Example:** Change `<button onClick={handleDelete}><FontAwesomeIcon icon={faTrash} /></button>` to `<button onClick={handleDelete} aria-label="Delete item"><FontAwesomeIcon icon={faTrash} /></button>`.
3.  **Choose descriptive labels:** Ensure the `aria-label` text is concise and accurately conveys the button's purpose to a user relying on a screen reader.
4.  **Verify existing labels:** Do not add `aria-label` to buttons that already have visible text labels or `aria-labelledby` attributes that reference existing text. This task specifically targets *icon-only* buttons.
5.  **Build and Lint:** After making changes, run `npm run build && npm run lint` to ensure no new errors or warnings are introduced.

This task is small and focused, directly contributing to the application's accessibility goals outlined in the roadmap.
