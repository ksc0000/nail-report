```markdown
# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, which focuses on improving stability, test coverage, and UX, including accessibility. The current state indicates that no substantive tasks have been completed by Jules yet. The constraint `no-new-npm-deps` is critical.

## Objective

Implement exactly one bounded task from Phase 2 of the roadmap: enhance accessibility by adding `aria-label` attributes to all icon-only buttons in the application.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/components/` (e.g., button components, list items, navigation)
- `src/App.tsx`
- `src/App.css` (for minor style adjustments if necessary, but unlikely for this task)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Identify all button elements (`<button>`) that contain only an icon (e.g., using an `<img>`, `<svg>`, or CSS icon font) and have no visible text.
- Add a descriptive `aria-label` attribute to each identified icon-only button. The label should clearly describe the button's action or purpose for screen reader users (e.g., "Delete item", "Edit item", "Add new item", "Sign out").
- Do not modify buttons that already have visible text or an existing `aria-label`.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Report any icon-only buttons that are not `button` elements (e.g., `div` with click handler) as a follow-up item.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
