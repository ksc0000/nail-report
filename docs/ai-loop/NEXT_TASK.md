```markdown
# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task.

## Objective

Implement accessibility improvements by adding `aria-label` attributes to all icon-only buttons in the application.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/components/` (where most icon buttons are located)
- `src/App.css` (for any minor layout adjustments if necessary, though unlikely)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Identify all `button` elements that contain only an icon (e.g., `<Button><Icon /></Button>`) and add a descriptive `aria-label` attribute to them.
- The `aria-label` should clearly describe the button's action (e.g., "Delete item", "Edit item", "Share link", "Upload image").
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files. (Not applicable for this task, as it's UI-focused).
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
