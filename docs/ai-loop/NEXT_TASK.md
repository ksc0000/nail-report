# Worker Prompt Template

## Context

The application is in Phase 2, focusing on improving stability, test coverage, and UX. This task addresses a specific item within the Accessibility (2.4) sub-phase.

## Objective

Enhance accessibility by adding `aria-label` attributes to all icon-only buttons across the application.

## Allowed Scope

- `src/` (except `src/main.tsx`) - primarily component files (`.tsx`) and potentially shared button components.
- `src/App.css` (only if absolutely necessary for layout adjustments related to labels, which is unlikely for this task).

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
- Prefer adding tests when touching `src/lib/` files (not applicable for this task).
- Report follow-up items as comments, not additional code.

## Worker prompt

1.  **Identify Icon-Only Buttons**: Traverse the `src/` directory to locate all `<button>` elements that primarily or exclusively contain an icon (e.g., using `FontAwesomeIcon` or similar) and do not have visible text content serving as a label.
2.  **Add `aria-label`**: For each identified icon-only button, add an `aria-label` attribute. The value of `aria-label` should be a concise and descriptive string that clearly communicates the button's purpose to assistive technologies (e.g., screen readers).
    *   **Example**: Change `<button><FontAwesomeIcon icon={faEdit} /></button>` to `<button aria-label="Edit item"><FontAwesomeIcon icon={faEdit} /></button>`.
    *   **Example**: Change `<button><FontAwesomeIcon icon={faTrash} /></button>` to `<button aria-label="Delete item"><FontAwesomeIcon icon={faTrash} /></button>`.
    *   Consider context when crafting the `aria-label` (e.g., "Add new tag" vs. "Add tag" if multiple add buttons exist).
3.  **Verify**: Ensure that the addition of `aria-label` does not negatively impact the visual layout or functionality of the buttons.
4.  **Lint and Build**: Before submitting, ensure the project builds successfully and passes lint checks.

### Acceptance Criteria

- All icon-only buttons in the application have an appropriate and descriptive `aria-label` attribute.
- No new npm packages are added.
- The change adheres to the line diff limit.

### Required Test Commands

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
