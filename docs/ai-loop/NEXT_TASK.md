```markdown
# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. Specifically, Phase 2.4 targets accessibility improvements. This task focuses on enhancing the accessibility of interactive elements by ensuring all icon-only buttons have appropriate `aria-label` attributes.

## Objective

Identify all icon-only buttons throughout the application and add a descriptive `aria-label` attribute to each, explaining its purpose or action.

## Allowed Scope

-   `src/` (excluding `src/main.tsx`)
    -   This includes React component files (`.tsx`) where buttons are defined.
-   `src/App.css` (only if a button style change is accidentally needed to support accessibility, but unlikely for this task)

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
-   Ensure every interactive `<button>` element that contains only an icon (e.g., `<FontAwesomeIcon>`, `<img>`, or SVG) and no visible text has a meaningful `aria-label`.
-   The `aria-label` should clearly describe the button's action (e.g., "Delete item", "Edit tag", "Share report", "Open navigation").

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

## Worker Prompt

Your task is to improve the accessibility of the `nail-report` application by adding `aria-label` attributes to all icon-only buttons.

1.  **Scan Component Files**: Systematically go through all React component files in the `src/` directory (excluding `src/main.tsx`).
2.  **Identify Icon-Only Buttons**: Look for `<button>` elements that primarily contain:
    *   A single icon component (e.g., `<FontAwesomeIcon icon={faEdit} />`).
    *   An `<img>` tag used as an icon.
    *   An inline SVG or an SVG component acting as an icon.
    *   Crucially, these buttons should **not** have any visible text content alongside the icon that describes its function.
3.  **Add `aria-label`**: For each identified icon-only button, add an `aria-label` attribute with a concise and descriptive text that explains the button's function to screen reader users.
    *   **Example:**
        ```tsx
        // Before
        <button onClick={handleEdit}>
          <FontAwesomeIcon icon={faEdit} />
        </button>

        // After
        <button onClick={handleEdit} aria-label="Edit item">
          <FontAwesomeIcon icon={faEdit} />
        </button>
        ```
4.  **Test**: After making changes, run `npm run build` and `npm run lint` to ensure no errors or warnings are introduced.

This task is focused solely on adding `aria-label` attributes. Do not refactor components, change styling (unless absolutely necessary for accessibility and within the line limit), or implement new features.

```
```
