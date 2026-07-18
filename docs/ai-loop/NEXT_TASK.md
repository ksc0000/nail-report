# Worker Prompt Template

## Context

The current phase focuses on improving stability, test coverage, and user experience, with a specific emphasis on accessibility. This task aims to enhance the accessibility of the application for users relying on screen readers.

## Objective

Identify all interactive elements that appear as "icon-only buttons" (i.e., buttons or elements with click handlers that display only an icon without visible text) and add a descriptive `aria-label` attribute to each. The `aria-label` should clearly describe the button's action to screen reader users.

## Allowed Scope

- `src/components/**/*.tsx` (or other component files)
- `src/App.tsx` (if icon-only buttons exist there)
- `src/layouts/**/*.tsx` (if icon-only buttons exist there)
- `src/App.css` (for minor stylistic adjustments if necessary, but focus on `aria-label`)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- For each icon-only interactive element, add an `aria-label` attribute with a concise, descriptive text (e.g., `aria-label="Delete item"`, `aria-label="Edit tag"`, `aria-label="Upload image"`).
- Ensure the `aria-label` is localized if the app supports i18n in the future (for now, use English).
- Do not add `aria-label` to elements that already have visible, descriptive text or an `aria-labelledby` reference.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
