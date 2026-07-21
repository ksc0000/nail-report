# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on stability, test coverage, and UX improvements. This task specifically addresses Phase 2.4: Accessibility.

## Objective

Identify icon-only buttons throughout the application and add appropriate `aria-label` attributes to improve accessibility for users of assistive technologies.

## Allowed Scope

- `src/` (Specifically component files in `src/components`, `src/App.tsx`, and other relevant UI files that contain icon buttons).
- `src/App.css` (Only if minor styling adjustments are absolutely necessary to accommodate the changes, but this is unlikely).

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Focus initially on the most prominent and frequently used icon-only buttons, such as those in the main navigation, item list, or item detail view.
- For each icon-only button, add a descriptive `aria-label` attribute that clearly communicates the button's purpose (e.g., `aria-label="Delete item"`, `aria-label="Edit settings"`, `aria-label="Upload image"`).
- Ensure the `aria-label` values are localized if the app supports multiple languages (though for this task, English is sufficient).
- Run `npm run build && npm run lint` before finishing.
- Provide a summary of the buttons changed and their new `aria-label` values.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
