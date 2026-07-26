# Worker Prompt Template

## Context

The `nail-report` application is currently in Phase 2 of its roadmap, focusing on improving stability, test coverage, and user experience. Specifically, Phase 2.4 targets Accessibility improvements. This task directly addresses one of these accessibility goals by enhancing keyboard navigation and screen reader support.

## Objective

Identify all icon-only buttons within the application and add appropriate `aria-label` attributes to them, ensuring they are accessible to users of assistive technologies.

## Allowed Scope

-   `src/components/**/*.tsx` (or similar component files)
-   `src/App.tsx` (if icon buttons are present directly)
-   `src/App.css` (only if minor styling adjustments are needed due to `aria-label` addition, unlikely)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Prefer adding tests when touching `src/lib/` files. (Not applicable for this UI-focused task)
-   Report follow-up items as comments, not additional code.

## Worker prompt

1.  **Identify Icon-Only Buttons**: Traverse the `src/` directory to locate all HTML `<button>` elements that primarily display an icon and do not have visible text labels or already have suitable `aria-label` attributes.
2.  **Add `aria-label`**: For each identified icon-only button, add a descriptive `aria-label` attribute.
    *   The `aria-label` should clearly convey the button's purpose to a screen reader user.
    *   Examples:
        *   For a delete icon button: `<button aria-label="Delete item">...</button>`
        *   For an edit icon button: `<button aria-label="Edit item">...</button>`
        *   For a share icon button: `<button aria-label="Share item">...</button>`
        *   For an add item icon button: `<button aria-label="Add new item">...</button>`
        *   For a sign-out icon button: `<button aria-label="Sign out">...</button>`
3.  **No New Dependencies**: Ensure no new npm packages or modifications to `package.json` dependencies are made.
4.  **Verify Application**: After making changes, run `npm run build` and `npm run lint` to confirm the application builds successfully and passes all lint checks.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
