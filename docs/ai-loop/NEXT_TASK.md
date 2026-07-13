# Worker Prompt Template

## Context

The product roadmap focuses on improving stability, test coverage, and UX in Phase 2. This task specifically addresses the accessibility goal of Phase 2.4 by ensuring interactive icon-only elements provide proper context for assistive technologies.

## Objective

Enhance accessibility by adding descriptive `aria-label` attributes to all icon-only interactive elements (buttons, links acting as buttons) throughout the application.

## Allowed Scope

- `src/**/*.tsx` (for UI components containing buttons/interactive elements)
- `src/**/*.ts` (if any component logic files are separate)
- `src/App.css` (for minor stylistic adjustments if needed, though unlikely for this task)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Identify all interactive elements that are visually represented by an icon but lack descriptive text or an `aria-label`.
- Add a meaningful `aria-label` attribute to each identified element, clearly describing its purpose to users of assistive technologies. For example, a delete icon button might have `aria-label="Delete item"`.
- Prioritize `button` elements, but also consider other interactive elements (e.g., `div` or `span` with `onClick` and only an icon child) that function as buttons.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Hey Jules,

Your next task is to improve the accessibility of the `nail-report` application.

**Detailed Instructions:**

1.  **Identify Icon-Only Interactive Elements:**
    *   Scan all React component files (`.tsx`) within the `src/` directory.
    *   Look for `<button>` elements that primarily contain an icon (e.g., an `<img>`, `<svg>`, or an icon font `<i>` tag) and no visible text.
    *   Also, look for other interactive elements like `<a>`, `<div>`, or `<span>` elements that have `onClick` handlers and only contain an icon, effectively acting as a button or interactive control.

2.  **Add `aria-label` Attributes:**
    *   For each identified icon-only interactive element, add an `aria-label` attribute.
    *   The value of `aria-label` must be a concise and descriptive string that clearly communicates the element's purpose to a screen reader user.
    *   **Example:**
        ```tsx
        // Before
        <button onClick={handleDelete} className="icon-button">
          <FaTrash />
        </button>

        // After
        <button onClick={handleDelete} aria-label="Delete item" className="icon-button">
          <FaTrash />
        </button>
        ```
    *   Ensure the `aria-label` is localized if the application supports multiple languages (though for this task, English is sufficient).

3.  **Verify Functionality and Linting:**
    *   After making changes, ensure the application still builds and runs correctly.
    *   Run `npm run build && npm run lint` and address any reported issues.

**Specific elements to look out for (not an exhaustive list, but common patterns):**
*   Delete buttons (e.g., trash can icon)
*   Edit buttons (e.g., pencil icon)
*   Share buttons (e.g., share icon)
*   Navigation buttons (e.g., arrow icons for pagination)
*   Close buttons (e.g., 'X' icon)

This task should result in a series of small, focused changes across several component files. If you encounter an unexpectedly large number of such elements, please document it in your `Known issues or limitations` section.

Good luck!
