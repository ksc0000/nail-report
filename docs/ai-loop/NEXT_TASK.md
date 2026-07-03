# Worker Prompt Template

## Context

The current focus is on Phase 2 of the roadmap, which aims to improve stability, test coverage, and UX. This task specifically addresses an item under Phase 2.4: Accessibility. The goal is to make the application more usable for users relying on assistive technologies.

## Objective

Identify all icon-only buttons within the application and add a descriptive `aria-label` attribute to each of them.

## Allowed Scope

- `src/` (excluding `src/main.tsx`)
- Specifically, component files in `src/components/` and other UI files in `src/` where icon-only buttons might be used.
- `src/App.css` (only if absolutely necessary, but unlikely for this task)

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
- Prefer adding tests when touching `src/lib/` files (not applicable for this UI task).
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to enhance the accessibility of the nail-report application by ensuring all interactive icon-only buttons have appropriate `aria-label` attributes.

1.  **Scan the codebase:** Navigate through `src/components/` and other relevant UI files (e.g., `src/App.tsx`, `src/features/`) to identify all `<button>` elements that primarily display an icon without accompanying visible text.
2.  **Add `aria-label`:** For each identified icon-only button, add a meaningful `aria-label` attribute that describes the button's purpose to assistive technologies. For example, a button displaying a '+' icon to add an item could have `aria-label="Add new item"`.
3.  **Verify functionality:** Ensure that adding `aria-label` does not alter the visual appearance or existing functionality of the buttons.
4.  **No new dependencies:** Do not introduce any new npm packages.

**Example Transformation:**

```jsx
// Before
<button onClick={handleDelete}>
  <TrashIcon />
</button>

// After
<button onClick={handleDelete} aria-label="Delete item">
  <TrashIcon />
</button>
```
