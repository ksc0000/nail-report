```markdown
# Worker Prompt Template

## Context

The application needs to improve its accessibility. This task focuses on enhancing the experience for users who rely on screen readers by providing meaningful labels for interactive elements.

## Objective

Identify all icon-only buttons throughout the application and add an appropriate `aria-label` attribute to each, clearly describing its function.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/components/` (most likely location for button modifications)
- `src/App.css` (if minor styling adjustments are needed to accommodate labels, though unlikely)
- `src/__tests__/` (if new tests are warranted for changed components)

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
- Systematically locate all `<button>` elements that primarily display an icon (e.g., using `react-icons` or similar) without accompanying visible text.
- For each identified icon-only button, add an `aria-label` attribute.
- The `aria-label` text must be descriptive of the button's action (e.g., "Delete item", "Edit profile", "Close dialog", "Add new tag").
- Ensure existing functionality and visual layout of buttons are not negatively impacted.
- No new npm dependencies should be added.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Okay, Jules, your task is to improve the accessibility of the `nail-report` application by adding `aria-label` attributes to all icon-only buttons.

Here's a detailed breakdown:

1.  **Identify Icon-Only Buttons:**
    *   Thoroughly search through the React component files in `src/components/` and `src/` for `<button>` elements.
    *   Focus on buttons that only render an icon (e.g., `<button><FaPlus /></button>`, `<button><img src="..." alt="" /></button>`). Buttons that have visible text labels do not need an `aria-label` unless the icon is part of a larger, more complex accessible name strategy (which is not the focus of this task).

2.  **Add `aria-label` Attribute:**
    *   For each identified icon-only button, add an `aria-label="Your descriptive text here"` attribute.
    *   The `aria-label` should clearly and concisely describe the button's function to a screen reader user.
        *   **Examples:**
            *   A button with a trash icon for deleting an item might get `aria-label="Delete item"`.
            *   A button with a pencil icon for editing might get `aria-label="Edit item"`.
            *   A button with a plus icon for adding something might get `aria-label="Add new item"`.
            *   A button with an 'X' icon for closing a modal might get `aria-label="Close dialog"`.
            *   A button for sharing might get `aria-label="Share"` or `aria-label="Share item"`.
            *   A button for uploading an image might get `aria-label="Upload image"`.
            *   A button for a tag might get `aria-label="Add tag"`.

3.  **Verify Functionality:**
    *   Ensure that the addition of `aria-label`s does not break any existing button functionality or visual styling.

4.  **Lint and Build:**
    *   Before concluding the task, run `npm run build` and `npm run lint` to catch any compilation or style issues.

**Example of a change:**

```diff
// Before
-<button className="icon-button">
-  <FaTrashAlt />
-</button>

// After
-<button className="icon-button" aria-label="Delete item">
-  <FaTrashAlt />
-</button>
```

Good luck!
```
