# Worker Prompt Template

## Context

The application needs to improve its accessibility. A key part of this is ensuring that users relying on screen readers can understand the function of interactive elements, especially buttons that consist only of icons without visible text labels.

## Objective

Identify all buttons in the application that are represented solely by an icon (i.e., they have no visible text content) and add a descriptive `aria-label` attribute to each of them. The `aria-label` should clearly state the button's purpose (e.g., "Delete item", "Edit profile", "Add new tag").

## Allowed Scope

- `src/` (any file within `src/` except `src/main.tsx`)
- `src/components/` (likely place for many icon buttons)
- `src/App.tsx` (if it contains icon-only buttons)
- `src/lib/` (if helper functions are used to render buttons, but unlikely for this task)
- `src/__tests__/` (no new tests required for this task, as it's a UI attribute)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines. Focus on adding `aria-label` attributes to existing button elements.
- Each `aria-label` should be concise and accurately describe the button's action.
- Run `npm run build && npm run lint` before finishing to ensure code quality and no build errors.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
