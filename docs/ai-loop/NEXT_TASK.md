# Worker Prompt Template

## Context

The current focus is Phase 2 of the roadmap, specifically improving Accessibility (2.4). This task aims to enhance the usability of interactive elements for assistive technologies.

## Objective

Identify all icon-only buttons (buttons that display only an icon and no visible text label) within the application and add a descriptive `aria-label` attribute to each one. The `aria-label` should clearly convey the button's action or purpose.

## Allowed Scope

- `src/` (excluding `src/main.tsx`) - This includes React components, pages, and utility files where buttons might be defined.
- `src/App.css` (for minor style adjustments if absolutely necessary, but not the primary goal).

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- For each icon-only button found, add a meaningful `aria-label` attribute.
- The `aria-label` text should be concise and clearly describe the button's function (e.g., "Delete item", "Edit profile", "Share link").
- Run `npm run build && npm run lint` before finishing.
- Report any edge cases or buttons that are ambiguous for labeling in the "Known issues or limitations" section.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
