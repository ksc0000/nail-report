```markdown
# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task.

## Objective

Enhance accessibility by adding `aria-label` attributes to all icon-only interactive buttons throughout the application. This directly addresses Phase 2.4 of the product roadmap.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/` helpers (firestore.ts, storage.ts, auth.ts, publicShares.ts) - *unlikely to be modified for this task*
- `src/__tests__/` (new test files) - *unlikely to be created for this task*
- `src/App.css` (CSS improvements) - *unlikely to be modified for this task*

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
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Worker prompt

1.  Identify all button elements (`<button>`) that contain only an icon (e.g., using an SVG or icon font) and do not have visible text.
2.  For each identified icon-only button, add an `aria-label` attribute with a concise, descriptive text that explains its purpose.
    *   For example, a trash can icon button for deleting should have `aria-label="Delete item"`.
    *   A plus icon button for adding a new item should have `aria-label="Add new item"`.
    *   A pencil icon button for editing should have `aria-label="Edit item"`.
3.  Ensure the `aria-label` text provides sufficient context for users of assistive technologies.
4.  Do not add any new visible text labels; the goal is solely to improve accessibility for screen readers and similar tools.
5.  Prioritize adding `aria-label` directly to the `<button>` element.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
