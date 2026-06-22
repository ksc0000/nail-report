# Worker Prompt Template

## Context

The product roadmap includes improving accessibility in Phase 2.4. This task focuses on adding specific attributes to UI elements to enhance usability for assistive technologies.

## Objective

Add `aria-label` attributes to all icon-only buttons across the application to improve accessibility. These labels should provide a concise, descriptive text alternative for the button's action.

## Allowed Scope

- `src/**/*.tsx` (modify existing component files to add `aria-label` attributes)
- `src/App.css` (if minor style adjustments are needed for layout, but not expected)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Identify all button elements that contain only an icon and no visible text.
- Add an appropriate `aria-label` attribute to each identified button.
- The `aria-label` text should clearly describe the button's function (e.g., "Delete item", "Edit profile", "Share link").
- Keep diff ≤ 150 lines. Focus purely on adding the `aria-label` attributes.
- Run `npm run build && npm run lint` before finishing.
- Report any buttons that are intentionally left without an `aria-label` (e.g., if they are not truly interactive buttons or are part of a larger interactive component that already has sufficient labeling) as comments in the PR.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
