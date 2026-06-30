# Worker Prompt Template

## Context

The current phase is 2.0, focusing on improving stability, test coverage, and UX. This task targets Phase 2.4 Accessibility by addressing basic screen reader usability.

## Objective

Implement accessibility improvements by adding `aria-label` attributes to all icon-only buttons within the application.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/components/` (likely where most button changes will occur)
- `src/features/` (if any feature-specific components contain icon buttons)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Identify all `<button>` elements that primarily use an icon for their visual representation and lack a visible text label.
- Add a descriptive `aria-label` attribute to each identified icon-only button. The `aria-label` text should clearly communicate the button's action or purpose to assistive technologies (e.g., "Delete item", "Edit item", "Share report", "Upload image", "Back", "Close").
- Ensure the changes adhere to the ≤ 150 lines diff constraint. Prioritize common or easily identifiable icon buttons.
- Run `npm run build && npm run lint` before finishing to ensure no build or linting errors are introduced.
- Do not add any new npm dependencies.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
