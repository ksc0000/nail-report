# Worker Prompt Template

## Context

The product roadmap focuses on improving stability, test coverage, and UX in Phase 2. This task specifically targets accessibility improvements. The current state shows that no specific accessibility tasks have been completed yet.

## Objective

Improve accessibility by adding descriptive `aria-label` attributes to all icon-only buttons throughout the application.

## Allowed Scope

- `src/components/` (or other component files containing icon buttons)
- `src/App.css` (for minor style adjustments, if necessary)
- `src/` (except `src/main.tsx`)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Identify all `<button>` elements that visually contain only an icon and lack a visible text label.
- For each identified icon-only button, add an `aria-label` attribute with a concise, descriptive text that explains the button's purpose (e.g., `aria-label="Delete item"`, `aria-label="Edit tag"`).
- Ensure the `aria-label` provides sufficient context for screen reader users.
- Do not add `aria-label` to buttons that already have visible text or an appropriate `alt` attribute for an image inside (though icon buttons usually use SVG or font icons).
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
