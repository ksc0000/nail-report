# Worker Prompt Template

## Context

The current focus is on improving the stability, test coverage, and UX of the `nail-report` application as part of Phase 2 of the product roadmap. This task specifically addresses an accessibility improvement.

## Objective

Improve accessibility by adding descriptive `aria-label` attributes to all icon-only buttons throughout the application.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/components/` (modifying existing components)
- `src/views/` (modifying existing views)
- `src/App.css` (minor CSS adjustments if strictly necessary for styling an `aria-label` visually for testing, though not expected)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- **Acceptance Criteria**:
    - Identify all interactive elements (buttons, `role="button"`, etc.) that display only an icon and no visible text.
    - Add a concise and descriptive `aria-label` attribute to each identified element.
    - The `aria-label` text must clearly convey the purpose or action of the button.
    - Examples: a trashcan icon button -> `aria-label="Delete item"`, a pencil icon button -> `aria-label="Edit item"`, a share icon button -> `aria-label="Share item"`.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
