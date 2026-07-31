# Worker Prompt Template

## Context

The `nail-report` application is currently in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. A key aspect of UX improvement is ensuring the application is accessible to all users. This task focuses on enhancing accessibility by providing better semantic information for screen readers regarding interactive elements.

## Objective

Enhance the accessibility of the `nail-report` application by identifying all icon-only buttons and adding appropriate `aria-label` attributes to them.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/components/` (where most UI components reside)
- Any other UI-related files within `src/` that contain icon-only buttons.
- `src/App.css` (only for minor, incidental styling if absolutely necessary to accommodate changes, but not expected).

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
- Identify all `<button>` elements that primarily use an icon for their visual representation and do not already have an `aria-label` or visible text content.
- For each identified button, add a descriptive `aria-label` attribute that clearly communicates the button's purpose or action (e.g., "Delete item", "Edit tag", "Upload image").
- Ensure the `aria-label` text is concise and accurately reflects the button's functionality.
- Do not add `aria-label` to buttons that already have visible text content or an existing `aria-label`.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
