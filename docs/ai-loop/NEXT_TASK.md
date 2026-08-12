# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. Specifically, we are addressing Phase 2.4, which aims to enhance accessibility. This task focuses on improving the usability of interactive elements for all users by adding descriptive labels to icon-only buttons.

## Objective

Implement accessibility improvements by adding `aria-label` attributes to all icon-only buttons throughout the application.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/components/` (modifying existing components to add `aria-label`)
- `src/lib/` (no changes expected, but allowed for reference)
- `src/App.css` (no changes expected)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Identify all buttons that consist solely of an icon (e.g., delete, edit, share, close, add, back buttons) and add a descriptive `aria-label` attribute.
- The `aria-label` should clearly describe the button's action (e.g., `aria-label="Delete item"`, `aria-label="Edit nail report"`, `aria-label="Share report"`).
- Ensure existing functionality of the buttons remains unchanged.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---

## Worker Prompt

Your task is to improve the accessibility of the nail-report application by adding `aria-label` attributes to all icon-only buttons.

1.  **Identify Icon-Only Buttons:**
    *   Scan through `src/components/` and `src/App.tsx` (if any buttons are directly there) to find `<button>` elements that primarily use an icon (e.g., from an SVG or a component like `FaTrashAlt`, `FaEdit`, etc.) without visible text.
    *   Examples of components that likely contain such buttons include `NailItemCard.tsx`, `EditNailItemDialog.tsx`, `ShareNailItemDialog.tsx`, `MonthlyStats.tsx`, or any common header/navigation components.

2.  **Add `aria-label`:**
    *   For each identified icon-only button, add an `aria-label` attribute with a concise and descriptive text that explains the button's action.
    *   **Example:**
        ```tsx
        <button className="..." onClick={handleDelete} aria-label="Delete nail item">
          <FaTrashAlt />
        </button>
        ```
    *   Ensure the `aria-label` is localized if possible (though for this task, English is sufficient).
    *   If a button's label can dynamically change (e.g., "Add new item" vs. "Save item"), ensure the `aria-label` reflects the current state or provides a generic, always-true description.

3.  **Testing:**
    *   Manually test the application to ensure all buttons still function as expected.
    *   Run `npm run build` to check for compilation errors.
    *   Run `npm run lint` to ensure no linting issues are introduced.

This task is focused purely on adding attributes and should not involve changing button styling or behavior beyond the accessibility attribute.

**Note:** If a button already has a visible text label and an icon, an `aria-label` might not be strictly necessary, or it should complement the existing text. Focus primarily on buttons that *only* have an icon.
