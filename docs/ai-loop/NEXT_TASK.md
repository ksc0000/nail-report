# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses an item under Phase 2.4, Accessibility. The goal is to enhance the user experience for assistive technologies by providing descriptive labels for interactive elements.

## Objective

Add `aria-label` attributes to all icon-only buttons across the application to improve accessibility.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/components/` (modifying existing components)
- `src/App.css` (minor layout adjustments if necessary, though unlikely for this task)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Identify all `button` elements that contain only an icon and no visible text.
- Add a descriptive `aria-label` attribute to each identified button. The label should clearly explain the button's action (e.g., "Delete item", "Edit tag", "Upload image").
- Ensure the `aria-label` content is localized if a localization framework is present (currently, no i18n is used, so direct strings are fine).
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
