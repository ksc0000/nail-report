# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. Specifically, we're addressing section 2.4 Accessibility. This task aims to enhance the user experience for assistive technologies by making interactive elements more descriptive.

## Objective

Add `aria-label` attributes to all icon-only buttons throughout the application. This will provide meaningful descriptions for screen reader users, improving accessibility.

## Allowed Scope

- `src/` (components, views, etc., where icon-only buttons are rendered)
- `src/App.css` (for minor styling adjustments if absolutely necessary, but not the primary focus)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Identify all buttons that contain only an icon (no visible text label) and add an appropriate `aria-label` attribute.
- The `aria-label` should clearly describe the button's action or purpose.
- Keep the total line diff for the PR to ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing and ensure no new errors or warnings are introduced.
- Report follow-up items as comments in the PR, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
