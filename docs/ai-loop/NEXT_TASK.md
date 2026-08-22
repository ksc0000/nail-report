# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task directly addresses Phase 2.4, Accessibility.

## Objective

Add `aria-label` attributes to all icon-only buttons in the application to improve accessibility for screen reader users.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/components/` (modify existing component files)
- `src/App.css` (only if absolutely necessary for button styles, but unlikely for this task)

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
- Prefer adding tests when touching `src/lib/` files (not applicable for this task).
- Report follow-up items as comments, not additional code.

## Worker prompt

Implement the following:

1.  **Identify all icon-only buttons**: Systematically go through the `src/` directory, especially component files (`src/components/`, `src/App.tsx`), to find all `<button>` elements that contain only an icon (e.g., `<button><Icon /></button>`, `<button><img /></button>`, or `<button><span><Icon /></span></button>`).
2.  **Add `aria-label` attribute**: For each identified button, add an `aria-label` attribute with a concise, descriptive text that explains the button's action.
    *   For example, a delete button might get `aria-label="Delete item"`.
    *   A close button might get `aria-label="Close dialog"`.
    *   A navigation button to go back might get `aria-label="Go back"`.
3.  **Ensure descriptive labels**: The `aria-label` should provide a clear and useful description for users who cannot see the visual icon. Avoid redundant labels if the button already has visible text. This task specifically targets *icon-only* buttons.

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
