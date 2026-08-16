# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, which focuses on improving stability, test coverage, and UX. This task contributes to Phase 2.4: Accessibility. The goal is to enhance the user experience for assistive technologies by providing clear labels for interactive elements.

## Objective

Identify all icon-only buttons in the application and add an appropriate `aria-label` attribute to each. The `aria-label` should clearly describe the button's action or purpose.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/components/` (modifying existing React components)
- `src/pages/` (modifying existing page components)

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
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to improve the accessibility of the `nail-report` application by adding `aria-label` attributes to all buttons that display only an icon without visible text.

**Instructions:**

1.  **Identify Icon-Only Buttons:** Systematically go through the `src/` directory, focusing on `src/components/` and `src/pages/`, to locate all `<button>` elements that only contain an icon (e.g., an SVG, an `<img>` tag, or a UI library icon component) and no descriptive text content.
2.  **Add `aria-label`:** For each identified button, add an `aria-label` attribute with a concise, descriptive text that explains the button's function to a screen reader.
    *   **Example:** A button with a trash can icon for deleting an item should have `aria-label="Delete item"`.
    *   **Example:** A button with a plus icon for adding a new item should have `aria-label="Add new item"`.
    *   Ensure the `aria-label` is localized if the application supports multiple languages (though for this task, a simple English string is sufficient).
3.  **Test:** Ensure the application still builds and passes lint checks.

**Acceptance Criteria:**

-   All icon-only buttons in `src/components/` and `src/pages/` must have a semantically appropriate `aria-label` attribute.
-   The application must build successfully (`npm run build`).
-   The linter must report no errors (`npm run lint`).

**Required test commands:**

```bash
npm run build
npm run lint
```
