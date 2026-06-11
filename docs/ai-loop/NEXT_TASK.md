```markdown
# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This includes specific goals for accessibility. The current task is to make a tangible improvement in this area.

## Objective

Identify all icon-only buttons in the application and add appropriate `aria-label` attributes to improve accessibility for screen reader users.

## Allowed Scope

- `src/components/` (modifying existing components)
- `src/features/` (modifying existing feature components)
- `src/App.tsx` (if any top-level buttons exist here, but prefer component-level changes)
- `src/App.css` (minor CSS adjustments if absolutely necessary for layout, but unlikely for this task)

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
- **Acceptance Criteria:**
    - All functional buttons that contain only an icon (no visible text) now have a descriptive `aria-label` attribute.
    - The `aria-label` accurately describes the button's action or purpose (e.g., "Delete item", "Edit tag", "Upload image", "Back to list", "Sign out").
    - The changes do not introduce visual regressions or break existing functionality.
- **Required test commands:**
    ```bash
    npm run build
    npm run lint
    ```

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

```
