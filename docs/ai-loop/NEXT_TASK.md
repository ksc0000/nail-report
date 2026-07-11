# Worker Prompt Template

## Context

The current phase is 2.0, focusing on improving stability, test coverage, and UX. This task addresses a specific item within Phase 2.4: Accessibility. The goal is to enhance the application's accessibility by providing meaningful labels for interactive elements.

## Objective

Add `aria-label` attributes to all icon-only buttons throughout the application to improve accessibility for users of assistive technologies.

## Allowed Scope

-   `src/` (except `src/main.tsx`)
-   `src/components/` (where most icon buttons are likely defined or used)
-   `src/App.tsx` (for global layout or primary navigation buttons)
-   Other view files within `src/` that render icon-only buttons.
-   `src/App.css` (only for minor style adjustments if absolutely necessary, but not expected for this task).

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
-   Identify all `<button>` elements that primarily display an icon without visible text.
-   Add a descriptive `aria-label` attribute to each identified icon-only button. The label should clearly convey the button's purpose (e.g., "Delete item", "Edit profile", "Go back").
-   Ensure existing functionality of the buttons remains unchanged.
-   No new npm dependencies should be added.

## Worker prompt

1.  **Identify Icon-Only Buttons:**
    *   Navigate through the application's UI components and views, particularly files in `src/components/` and `src/App.tsx`.
    *   Look for `<button>` HTML elements or custom `Button` components that render an icon (e.g., SVG, `<img>` tag, or an icon component like `FaIcon`) but do *not* have accompanying visible text.

2.  **Add `aria-label`:**
    *   For each icon-only button identified, add an `aria-label` attribute.
    *   The value of `aria-label` should be a concise and descriptive string that explains the button's action or purpose.
    *   **Example:**
        *   Before: `<button><TrashIcon /></button>`
        *   After: `<button aria-label="Delete item"><TrashIcon /></button>`
    *   **Example (with a custom component):**
        *   Before: `<IconButton icon={EditIcon} onClick={handleEdit} />`
        *   After: `<IconButton icon={EditIcon} aria-label="Edit item" onClick={handleEdit} />` (assuming `IconButton` passes `aria-label` to the underlying button element).

3.  **Verification:**
    *   Visually inspect the application to ensure the changes did not alter the visual layout or functionality.
    *   Run `npm run build` and `npm run lint` to ensure no build errors or linting warnings are introduced.

4.  **Reporting:**
    *   List the files that were modified.
    *   Summarize the changes made (e.g., "Added `aria-label` to X icon buttons in Y files").

This task focuses solely on adding the `aria-label` attribute and should not involve refactoring component structures or changing styling unless absolutely necessary for the `aria-label` to function correctly (which is highly unlikely).
