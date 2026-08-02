```markdown
# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, which focuses on improving stability, test coverage, and UX. This task specifically targets Phase 2.4 Accessibility by improving screen reader support for interactive elements. The current state has strict constraints, including `no-new-npm-deps`.

## Objective

Enhance the accessibility of the application by identifying all icon-only interactive button elements and adding a descriptive `aria-label` attribute to each.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- Specifically, component files within `src/components/` or other `src/` files that define interactive UI elements.

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
- Prefer adding tests when touching `src/lib/` files. (Not applicable for this UI task).
- Report follow-up items as comments, not additional code.

## Worker prompt

Your task is to implement the following:

1.  **Identify Icon-Only Buttons**: Locate all `<button>` elements across the `src/` directory that contain only an icon (e.g., an SVG icon, a Font Awesome icon, or a custom icon component) and no visible text content. These are typically used for actions like "edit", "delete", "share", "upload", etc.
2.  **Add `aria-label`**: For each identified icon-only button, add an `aria-label` attribute. The value of `aria-label` must be a concise, descriptive text that conveys the button's purpose to screen reader users (e.g., `aria-label="Delete item"`, `aria-label="Edit nail report"`, `aria-label="Upload image"`).
3.  **Verify Functionality**: Ensure that adding `aria-label`s does not introduce any regressions in the application's visual display or functionality.

**Example:**

Change from:
```tsx
<button onClick={handleDelete}>
  <TrashIcon />
</button>
```
To:
```tsx
<button onClick={handleDelete} aria-label="Delete item">
  <TrashIcon />
</button>
```

## Acceptance Criteria

- All icon-only interactive buttons have a descriptive `aria-label`.
- No new npm packages are added.
- The application builds and lints without errors.
- Existing functionality remains unchanged.

## Required test commands

```bash
npm run build
npm run lint
```

## Suggested next task

Add loading skeleton to nail item list (`src/App.tsx`).
```
