```markdown
# Worker Prompt Template

## Context

The product roadmap focuses on improving stability, test coverage, and UX in Phase 2. The current state shows that no substantive roadmap tasks have been completed yet. This task addresses a key accessibility improvement by adding `aria-label` attributes to icon-only buttons, making the application more usable for assistive technologies.

## Objective

Identify all icon-only buttons across the application and add appropriate `aria-label` attributes to improve accessibility.

## Allowed Scope

- `src/components/` (modifying existing UI components)
- `src/App.css` (if minor styling adjustments are needed to accommodate accessibility)
- `src/pages/` (if icon buttons are directly in page components)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/lib/` (no changes to helper functions needed for this task)
- `src/__tests__/` (no new test files required for this task, focus on direct implementation)

## Requirements

- Keep diff ≤ 150 lines.
- Identify all `button` elements that contain only an icon (e.g., `<button><Icon /></button>`) and add a descriptive `aria-label` attribute.
- The `aria-label` should clearly describe the button's action (e.g., "Delete item", "Edit profile", "Upload image").
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

Please implement the following:

1.  **Identify Icon-Only Buttons**: Traverse the `src/components/` and `src/pages/` directories to find all `<button>` elements that primarily display an icon and do not have visible text.
2.  **Add `aria-label`**: For each identified button, add a concise and descriptive `aria-label` attribute that explains the button's purpose to screen readers. For example, a delete button with a trash can icon might get `aria-label="Delete item"`.
3.  **Verify**: Visually inspect common pages (e.g., item list, item detail, edit forms) to ensure buttons still function as expected. Although not strictly required, consider using browser developer tools to check the accessibility tree if possible to confirm `aria-label` is present.
4.  **Lint and Build**: Ensure the project still builds and passes lint checks.

**Example Transformation:**

```typescript jsx
// Before
<button onClick={handleDelete} className="icon-button">
  <TrashIcon />
</button>

// After
<button onClick={handleDelete} className="icon-button" aria-label="Delete item">
  <TrashIcon />
</button>
```
```
