# Worker Prompt Template

## Context

The product roadmap for `nail-report` includes improving accessibility in Phase 2.4. This task focuses on a specific accessibility improvement: ensuring icon-only buttons are properly labeled for screen readers.

## Objective

Enhance accessibility by identifying all icon-only buttons in the application and adding a descriptive `aria-label` attribute to each.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/components/` (modifying existing components)
- `src/views/` (modifying existing view components)
- `src/App.css` (if minor styling adjustments are needed, but not expected)

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
- Prefer adding tests when touching `src/lib/` files. (Not applicable for this UI task)
- Report follow-up items as comments, not additional code.

## Worker prompt

Your task is to add `aria-label` attributes to all icon-only buttons within the `nail-report` application to improve accessibility for screen reader users.

1.  **Identify Icon-Only Buttons:** Navigate through the application's React components (`src/components/`, `src/views/`, etc.) and locate all `<button>` elements that contain only an icon (e.g., using a library like `react-icons`) and no visible text label.
2.  **Add `aria-label`:** For each identified button, add a meaningful `aria-label` attribute that clearly describes the button's action. For example:
    *   A delete button with a trashcan icon might get `aria-label="Delete item"`
    *   An edit button with a pencil icon might get `aria-label="Edit item"`
    *   A close button with an 'X' icon might get `aria-label="Close dialog"`
    *   A share button might get `aria-label="Share item"`
3.  **Review and Test:**
    *   Ensure all relevant icon-only buttons have an `aria-label`.
    *   Verify the application still functions correctly.
    *   Run `npm run build` and `npm run lint` to confirm there are no new errors or warnings.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
