# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on stability, test coverage, and UX improvements. This task specifically targets accessibility improvements.

## Objective

Improve accessibility by adding `aria-label` attributes to all icon-only buttons within the application.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/components/` (focus on modifying existing component files that render icon buttons)
- `src/App.css` (only if necessary for minor styling adjustments related to button layout, but unlikely)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Identify all `button` elements that contain only an icon (i.e., no visible text content, only an SVG icon or similar component).
- Add a descriptive `aria-label` attribute to each identified icon-only button. The label should clearly explain the button's action (e.g., `aria-label="Delete item"`, `aria-label="Edit item"`, `aria-label="Upload image"`).
- Ensure the `aria-label` text is concise, human-readable, and accurately reflects the button's functionality.
- Prioritize buttons in core CRUD interfaces (e.g., list items, form actions).
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Report any icon-only buttons that are difficult to assign a clear `aria-label` for as a known issue.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
