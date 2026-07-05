```markdown
# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses the accessibility goal within Phase 2.4, by improving the experience for users relying on screen readers.

## Objective

Identify all icon-only buttons throughout the application and add a descriptive `aria-label` attribute to each to improve accessibility.

## Allowed Scope

- `src/components/` (modify existing components)
- `src/pages/` (modify existing pages)
- `src/App.css` (for minor styling adjustments if necessary, though unlikely for this task)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- **Identify Icon-Only Buttons:** Systematically go through all interactive elements (especially `<button>` tags) and identify those that visually present only an icon (e.g., delete, edit, add, close icons) without accompanying visible text.
- **Add `aria-label`:** For each identified icon-only button, add an `aria-label` attribute. The value of `aria-label` must be a concise, descriptive text that explains the button's action (e.g., `aria-label="Delete item"`, `aria-label="Add new tag"`, `aria-label="Close dialog"`).
- **Adhere to Line Limit:** Keep the total diff for the pull request at or below 150 lines. This task is expected to primarily involve adding attributes, so it should fit comfortably within this limit.
- **Lint and Build:** Run `npm run build && npm run lint` and resolve any reported issues before completing the task.
- **No New Dependencies:** Do not add any new npm packages.
- **No New Files:** This task should primarily involve modifying existing files.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
