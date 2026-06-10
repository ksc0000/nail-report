# Worker Prompt Template

## Context

The current phase is 2.0 of the product roadmap, focusing on improving stability, test coverage, and user experience. This task specifically addresses accessibility improvements under Phase 2.4, aiming to make the application more inclusive for users relying on assistive technologies.

## Objective

Enhance the accessibility of the application by identifying all interactive elements that are solely represented by an icon (icon-only buttons) and adding appropriate `aria-label` attributes to them. The `aria-label` should clearly and concisely describe the button's action or purpose, making it understandable for screen readers.

## Allowed Scope

- `src/` (excluding `src/main.tsx`)
- All `.tsx` files within `src/components/`, `src/views/`, and any other UI-related directories where icon-only buttons or interactive icon elements might be present.
- Modifications to existing JSX attributes.

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any changes that alter the visual appearance or core functionality of the application.

## Requirements

- Keep the diff ≤ 150 lines.
- Thoroughly scan the application's UI code for all buttons or interactive elements that display only an icon and lack visible text.
- For each identified element, add a semantically correct and descriptive `aria-label` attribute. For example, a button displaying only a trashcan icon should get `aria-label="Delete item"`.
- Avoid adding `aria-label` to elements that already have sufficient accessible names (e.g., buttons with visible text labels).
- Ensure no functional changes or visual regressions are introduced.
- Run `npm run build && npm run lint` before finishing and ensure no errors or warnings are reported.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
