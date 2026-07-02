# Worker Prompt Template

## Context

The product roadmap for nail-report is focused on improving stability, test coverage, and UX in Phase 2. This task specifically addresses an accessibility improvement. The current state shows that initial AI Loop setup is complete, and no substantive development tasks have been started yet.

## Objective

Enhance the accessibility of the application by adding `aria-label` attributes to all icon-only buttons throughout the application. This ensures screen reader users understand the purpose of each button.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/components/` (modifying existing components)
- `src/pages/` (modifying existing page components)
- `src/App.css` (if minor styling adjustments are needed, but not expected)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/lib/` (not expected for this task)

## Requirements

- Identify all buttons that contain only an icon (or an icon and minimal visual text hidden from screen readers) and do not have an explicit text label.
- Add a descriptive `aria-label` attribute to each identified button. The label should clearly convey the button's action (e.g., "Delete item", "Edit tag", "Share report", "Sign out").
- Ensure the `aria-label` text is concise and accurately reflects the button's function.
- Keep the diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
