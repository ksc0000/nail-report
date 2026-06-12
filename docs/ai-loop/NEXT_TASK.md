# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on stability, test coverage, and UX improvements. This task specifically addresses item `2.4 Accessibility` by enhancing screen reader support for interactive elements.

## Objective

Add `aria-label` attributes to all icon-only buttons throughout the application to improve accessibility for users relying on screen readers.

## Allowed Scope

- `src/` (except `src/main.tsx`) - Components containing icon-only buttons.
- `src/lib/` helpers (firestore.ts, storage.ts, auth.ts, publicShares.ts) - Unlikely to be modified for this task.
- `src/__tests__/` (new test files) - Not strictly required for this task, but if a button's logic is modified, consider a test.
- `src/App.css` (CSS improvements) - If minor layout adjustments are needed after adding attributes, but unlikely.

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Identify all buttons that contain only an icon and no visible text label.
- Add an appropriate `aria-label` attribute to each identified button. The label should concisely describe the button's action (e.g., `aria-label="Delete item"`, `aria-label="Edit item"`, `aria-label="Share"`).
- Keep the overall diff for the PR to ≤ 150 lines.
- Run `npm run build && npm run lint` successfully before finishing.
- Prefer adding tests when touching `src/lib/` files (not applicable here, but general guidance).
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
**Example icon button:**
```tsx
<button onClick={handleDelete}>
  <TrashIcon aria-hidden="true" />
</button>
```
**Should become:**
```tsx
<button onClick={handleDelete} aria-label="Delete item">
  <TrashIcon aria-hidden="true" />
</button>
```
Ensure `aria-hidden="true"` is also present on the icon itself to prevent screen readers from announcing redundant information.
