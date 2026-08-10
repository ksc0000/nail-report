# Worker Prompt Template

## Context

The product roadmap for nail-report is currently in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses an accessibility improvement from section 2.4 of the roadmap.

## Objective

Identify all icon-only buttons throughout the application and add an appropriate `aria-label` attribute to each for improved accessibility.

## Allowed Scope

- `src/` (excluding `src/main.tsx`) - This includes components, views, and any files where icon buttons might be defined.
- `src/App.css` (for minor layout adjustments if necessary, but not the primary focus)

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
- Prefer adding tests when touching `src/lib/` files (N/A for this task).
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to enhance the accessibility of the nail-report application by adding `aria-label` attributes to all icon-only buttons.

1.  **Identify Icon-Only Buttons:** Traverse the component tree, focusing on interactive elements that are visually represented by an icon but lack a visible text label (e.g., delete buttons, edit buttons, navigation icons).
2.  **Add `aria-label`:** For each identified icon-only button, add an `aria-label` attribute.
3.  **Descriptive Labels:** Ensure the `aria-label` accurately and concisely describes the button's purpose or action in a user-friendly manner.
    *   Examples: `aria-label="Delete item"`, `aria-label="Edit tag"`, `aria-label="Upload image"`, `aria-label="Close dialog"`, `aria-label="Toggle navigation"`.
4.  **Focus Areas:** Pay particular attention to components in the main list view, tag management modals, image upload interfaces, and any navigation elements.
5.  **No New Dependencies:** Do not add any new npm packages.
6.  **Lint and Build:** Ensure the project still builds and passes lint checks after your changes.

This task is small and self-contained, directly contributing to the accessibility goals of Phase 2.4.
