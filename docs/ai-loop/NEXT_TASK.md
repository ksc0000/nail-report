# Worker Prompt Template

## Context

The `nail-report` application is currently in Phase 2 of its roadmap, focusing on improving stability, test coverage, and user experience. This task specifically addresses accessibility improvements by ensuring interactive elements are properly labeled for assistive technologies.

## Objective

Implement exactly one bounded task from Phase 2 of the roadmap: Add `aria-label` attributes to all icon-only buttons throughout the application.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/components/` (modifying existing component JSX)
- `src/pages/` (modifying existing page JSX)
- `src/App.css` (CSS improvements, if any minor layout shifts occur, though none are expected for this task)

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
- Prefer adding tests when touching `src/lib/` files (not applicable for this UI-focused task).
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

Your task is to enhance the accessibility of the `nail-report` application by adding `aria-label` attributes to all icon-only buttons. These labels are crucial for users of assistive technologies to understand the purpose of buttons that do not have visible text.

**Instructions:**

1.  **Identify Icon-Only Buttons:** Navigate through the application's UI components and pages to find all `<button>` elements that primarily contain an icon (SVG, image, or icon component) and lack visible text content. This includes buttons for actions like "edit", "delete", "share", "add", "close", "navigate", etc.
2.  **Add `aria-label` Attribute:** For each identified icon-only button, add an `aria-label` attribute directly to the `<button>` tag.
3.  **Provide Meaningful Labels:** The value of the `aria-label` should be a concise and descriptive phrase that clearly communicates the button's function.
    *   Examples:
        *   For a delete icon button: `aria-label="Delete item"`
        *   For an edit icon button: `aria-label="Edit item"`
        *   For a share icon button: `aria-label="Share"`
        *   For a back arrow icon button: `aria-label="Go back"`
        *   For a close 'X' icon button: `aria-label="Close dialog"`
4.  **Preserve Functionality:** Ensure that adding `aria-label` attributes does not alter the visual appearance or existing JavaScript functionality of the buttons.
5.  **Focus on Primary UI:** Prioritize buttons in core navigation, item lists, and dialogs.

**Acceptance Criteria:**

- All prominent icon-only buttons within `src/components/` and `src/pages/` files have a descriptive `aria-label` attribute.
- The application's visual layout and interactive behavior remain unchanged.
- `npm run build` completes successfully.
- `npm run lint` reports no new errors.

**Required Test Commands:**

```bash
npm install # Ensure all dependencies are up-to-date
npm run build
npm run lint
```
