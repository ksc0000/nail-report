```markdown
# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, focusing on improving stability, test coverage, and UX. This task contributes to Phase 2.4 Accessibility by ensuring interactive elements are properly labeled for assistive technologies.

## Objective

Identify all icon-only buttons throughout the application and add appropriate `aria-label` attributes to them to improve accessibility.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/components/` (modifying existing component files)
- `src/App.tsx` (if icon-only buttons are present here)
- `src/App.css` (no changes expected for this task, but allowed)

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
- Prefer adding tests when touching `src/lib/` files. (Not applicable for this UI-focused task)
- Report follow-up items as comments, not additional code.

## Worker Prompt

1.  **Identify Icon-Only Buttons**: Traverse the application's React components, focusing on areas with interactive buttons that only display an icon (e.g., delete, edit, share, add, close, navigation icons).
2.  **Add `aria-label`**: For each identified icon-only button, add an `aria-label` prop with a concise, descriptive text that explains the button's action.
    *   **Example**: Change `<button onClick={handleDelete}><DeleteIcon /></button>` to `<button onClick={handleDelete} aria-label="Delete item"><DeleteIcon /></button>`.
3.  **Prioritize Core UI**: Start with key interaction areas such as the nail item list, image upload dialogs, tag management, and any navigation elements.
4.  **No Visual Changes**: The `aria-label` attribute should not introduce any visible changes to the UI.
5.  **Review existing attributes**: If a button already has a visually hidden text span or a title attribute that serves the same purpose, evaluate if `aria-label` is still necessary or if it would be redundant. Prefer `aria-label` for screen reader accessibility.

## Acceptance Criteria

- All icon-only buttons in the main application flow (CRUD, tag management, image handling) have a descriptive `aria-label` attribute.
- The application builds successfully.
- No new npm packages are added.

## Required Test Commands

```bash
npm install
npm run build
npm run lint
```

## Suggested next task

Add unit tests for `src/lib/auth.ts` helper functions.
```
