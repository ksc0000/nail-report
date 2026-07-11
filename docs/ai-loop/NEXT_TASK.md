# Worker Prompt Template

## Context

The current phase is 2.0 (Active), focusing on stability, test coverage, and UX. This task addresses accessibility improvements by ensuring all interactive elements are properly labeled for assistive technologies.

## Objective

Identify all icon-only buttons in the application and add an appropriate `aria-label` attribute to each of them.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/App.css` (CSS improvements, if any minor styling is needed for `aria-label` visibility in dev tools, though unlikely)

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

## Worker prompt

Your task is to improve the accessibility of the `nail-report` application by adding `aria-label` attributes to all buttons that only display an icon, without visible text.

1.  **Identify icon-only buttons:** Scan the `src/components/` directory and `src/App.tsx` for `<button>` elements that primarily contain an icon component (e.g., an SVG icon or a component rendering an icon) and lack descriptive text content.
2.  **Add `aria-label`:** For each identified icon-only button, add a meaningful `aria-label` attribute. The value of `aria-label` should clearly and concisely describe the button's function (e.g., "Delete nail item", "Edit entry", "Upload image", "Open menu").
3.  **Verify:** Ensure that the `aria-label` is descriptive and accurate for each button's intended action.

Example:
```tsx
// Before
<button onClick={handleEdit}>
  <EditIcon />
</button>

// After
<button onClick={handleEdit} aria-label="Edit nail item">
  <EditIcon />
</button>
```

**Acceptance Criteria:**
- All functional icon-only buttons across the application (in `src/components` and `src/App.tsx`) include an `aria-label` attribute.
- The `aria-label` content accurately reflects the button's action.
- The changes adhere to the line diff limit and do not introduce new npm dependencies.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
