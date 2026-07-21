# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, focusing on improving stability, test coverage, and UX. This task addresses an accessibility improvement from section 2.4.

## Objective

Identify all icon-only buttons throughout the application and add appropriate `aria-label` attributes to improve accessibility for screen reader users.

## Allowed Scope

- `src/components/` (modifying existing components)
- `src/pages/` (modifying page-level components)
- `src/App.css` (minor adjustments if absolutely necessary for button styling, but unlikely)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Each icon-only button must have a descriptive `aria-label` that conveys its purpose (e.g., "Delete item", "Edit item", "Add new item").
- Ensure the `aria-label` text is meaningful out of context.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files (N/A for this task as it's UI focused).
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
