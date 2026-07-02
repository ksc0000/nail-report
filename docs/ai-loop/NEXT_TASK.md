# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on stability, test coverage, and UX improvements. This task specifically addresses Phase 2.4 Accessibility. The goal is to improve the user experience for assistive technologies by providing clear labels for interactive elements.

## Objective

Identify all icon-only buttons within the application and add appropriate `aria-label` attributes to each of them. The `aria-label` should describe the button's purpose clearly for screen reader users.

## Allowed Scope

- `src/components/` (e.g., specific components containing buttons)
- `src/App.tsx` (if main application layout buttons need modification)
- Any other relevant `.tsx` files in `src/` containing icon-only buttons.
- `src/App.css` (only if absolutely necessary for minor styling adjustments related to attribute addition, but unlikely)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines. Focus only on adding `aria-label` attributes.
- Ensure the `aria-label` accurately describes the button's action (e.g., "Delete item", "Edit tag", "Share nail report").
- Run `npm run build && npm run lint` before finishing to ensure code quality and no build errors.
- Prefer adding tests when touching `src/lib/` files. (Not applicable for this task as it's UI-focused.)
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
