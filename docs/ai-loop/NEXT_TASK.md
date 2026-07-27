```markdown
# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses Phase 2.4 Accessibility, aiming to enhance the application's usability for screen reader users by adding descriptive labels to interactive elements.

## Objective

Identify all icon-only buttons throughout the application and add appropriate `aria-label` attributes to each of them. The `aria-label` should clearly describe the action performed by the button.

## Allowed Scope

- `src/` (except `src/main.tsx`) - focus on component files (`.tsx`) that render icon-only buttons.
- `src/App.css` (for minor, related style adjustments if absolutely necessary, but unlikely for this task).

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- For each icon-only button found, add an `aria-label` attribute with a concise, descriptive text. For example, a trash can icon button might get `aria-label="Delete item"`.
- Do not modify buttons that already have visible text labels or clear contextual meaning that doesn't rely solely on an icon.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to improve the accessibility of the nail-report application by ensuring all icon-only buttons have meaningful `aria-label` attributes.

1.  **Identify Icon-Only Buttons**: Go through the application's React components in the `src/` directory. Look for `<button>` elements that contain only an icon (e.g., using a `<i>` tag with a Font Awesome class) and no visible text.
2.  **Add `aria-label`**: For each identified icon-only button, add an `aria-label` attribute. The value of this attribute should be a human-readable description of the button's function.
    *   Example: `<button><i className="fa fa-pencil"></i></button>` should become `<button aria-label="Edit item"><i className="fa fa-pencil"></i></button>`
    *   Example: `<button><i className="fa fa-share-alt"></i></button>` should become `<button aria-label="Share item"><i className="fa fa-share-alt"></i></button>`
3.  **Validate**: After making changes, ensure the application still functions correctly and there are no visual regressions.
4.  **Lint and Build**: Run `npm run lint` and `npm run build` to confirm all code adheres to project standards and builds successfully.

### Acceptance Criteria

-   All icon-only buttons in the UI have a descriptive `aria-label` attribute.
-   The application builds successfully (`npm run build`).
-   The linter passes without warnings or errors (`npm run lint`).
-   The diff size is within the 150-line limit.

### Required Test Commands

```bash
npm install # Ensure dependencies are up-to-date
npm run build
npm run lint
```
```
