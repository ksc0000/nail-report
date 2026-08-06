```markdown
# Worker Prompt Template

## Context

The product roadmap focuses on improving stability, test coverage, and user experience in Phase 2. The current state shows that Phase 2 is active, and no specific feature-related tasks from the "Jules-ready Tasks" list have been started yet. This task targets accessibility improvements.

## Objective

Identify all icon-only buttons in the application and add appropriate `aria-label` attributes to improve accessibility.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/components/` (modifying existing components)
- `src/App.css` (minor adjustments if necessary, but unlikely)

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
- Prefer adding tests when touching `src/lib/` files. (This task primarily involves UI components, so new tests are not strictly required unless new logic is added).
- Report follow-up items as comments, not additional code.

## Worker Prompt

Your task is to enhance the accessibility of the `nail-report` application by adding `aria-label` attributes to all icon-only buttons.

1.  **Identify Icon-Only Buttons:** Systematically review the application's React components, especially those rendering interactive elements like `button`s, to find any buttons that rely solely on an icon for their visual representation and do not have a visible text label. Examples might include delete buttons, edit buttons, share buttons, or navigation icons.

2.  **Add `aria-label` Attributes:** For each identified icon-only button, add an `aria-label` attribute that clearly describes the button's purpose or action. The label should be concise and meaningful for screen reader users.
    *   Example: For a trash can icon button that deletes an item, use `<button aria-label="Delete item">...</button>`.
    *   Example: For an edit pencil icon, use `<button aria-label="Edit item">...</button>`.
    *   Example: For a share icon, use `<button aria-label="Share">...</button>`.
    *   Example: For a sign-out icon, use `<button aria-label="Sign out">...</button>`.

3.  **Verify Functionality:** Ensure that adding `aria-label` attributes does not negatively impact existing visual styles or interactive behavior.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
