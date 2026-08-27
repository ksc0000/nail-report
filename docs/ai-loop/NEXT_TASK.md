# Worker Prompt Template

## Context

The current phase of the roadmap focuses on improving stability, test coverage, and user experience, including accessibility (Phase 2.4). One crucial aspect of accessibility is ensuring that interactive elements are properly labeled for screen reader users.

## Objective

Identify all button elements (`<button>`) that contain only an icon (e.g., an `<img>`, `<svg>`, or a text-hidden icon font) and no visible text label. For each such button, add an appropriate `aria-label` attribute that clearly describes the button's action to screen reader users.

For example, a delete icon button might receive `aria-label="Delete item"`, and an edit icon button might receive `aria-label="Edit item"`.

## Allowed Scope

- `src/` (excluding `src/main.tsx`)
- `src/components/` (modifying existing components)
- `src/views/` (modifying existing views)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep the total diff for this task to ≤ 150 lines.
- For each identified icon-only button, add a descriptive `aria-label`.
- The `aria-label` content should be concise and accurately reflect the button's purpose.
- Run `npm run build && npm run lint` before finishing and ensure no errors or warnings are introduced.
- Prefer existing i18n mechanisms if available, otherwise use plain strings for labels.
- Report follow-up items as comments in the output, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
