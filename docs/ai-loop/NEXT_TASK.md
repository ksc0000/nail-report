# Worker Prompt Template

## Context

The application needs improved accessibility. Icon-only buttons currently lack textual labels, making them difficult for screen reader users to understand.

## Objective

Add `aria-label` attributes to all icon-only buttons in the application to provide accessible names for screen readers.

## Allowed Scope

- `src/components/` (modify existing component files)
- `src/App.tsx` (if icon buttons are directly in App.tsx)
- `src/App.css` (only if absolutely necessary for layout adjustments related to labels, but unlikely for this task)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- For every `<button>` element that contains only an icon (e.g., `<button><Icon /></button>`), add an `aria-label` attribute with a descriptive text for its action.
- The `aria-label` text should be concise and clearly communicate the button's purpose (e.g., "Delete item", "Edit item", "Add tag").
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
