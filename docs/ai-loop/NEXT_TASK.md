# Worker Prompt Template

## Context

The product roadmap prioritizes improving stability, test coverage, and UX in Phase 2. This task focuses on enhancing accessibility by ensuring all interactive elements are properly labeled for screen readers.

## Objective

Add `aria-label` attributes to all icon-only buttons throughout the application to improve accessibility for users relying on screen readers.

## Allowed Scope

- `src/components/` (modifying existing components)
- `src/` (other UI-related files where icon buttons might be present)
- `src/App.css` (minor adjustments if necessary for layout, but unlikely)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Identify all `<button>` elements that contain only an icon (e.g., `<button><FaPlus /></button>`) and add an appropriate `aria-label` attribute (e.g., `aria-label="Add new item"`).
- Ensure the `aria-label` clearly describes the button's action.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files. (Not applicable for this UI-focused task).
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

Implement the `aria-label` attributes:

1.  **Scan the `src/` directory** for `button` elements that likely render only an icon. Common patterns include buttons using react-icons (e.g., `Fa*`, `Ai*`, `Md*` components) without any visible text.
2.  **For each identified icon-only button**, add a descriptive `aria-label` attribute.
    *   Example: `<button onClick={addItem}><FaPlus /></button>` should become `<button onClick={addItem} aria-label="Add new item"><FaPlus /></button>`.
    *   Consider the context of the button to provide an accurate and concise label (e.g., "Delete item", "Edit profile", "Share link", "Close dialog", "Toggle navigation").
3.  **Prioritize buttons in core UI components** that are frequently used.
4.  **Avoid adding `aria-label` to buttons that already have visible text** or are not interactive.
5.  **Verify the changes locally** by building and linting the project.

**Acceptance criteria:** All significant icon-only buttons throughout the application (e.g., in `src/components`, `src/App.tsx`, `src/pages`) have an `aria-label` attribute describing their function.

**Required test commands:**
```bash
npm run build
npm run lint
```
