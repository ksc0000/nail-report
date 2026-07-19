# Worker Prompt Template

## Context

The current phase of the roadmap focuses on improving stability, test coverage, and UX. This task specifically addresses accessibility by enhancing screen reader support for interactive elements.

## Objective

Identify all icon-only buttons within the application and add a descriptive `aria-label` attribute to each, improving accessibility for screen reader users.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/` helpers (firestore.ts, storage.ts, auth.ts, publicShares.ts)
- `src/__tests__/` (new test files)
- `src/App.css` (CSS improvements)

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
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Implement the following task:

1.  **Locate Icon-Only Buttons:** Traverse the application's UI components (e.g., `src/components/`, `src/App.tsx`) to find all `<button>` elements that primarily use an icon (SVG, image, or icon font) as their sole visible content, without accompanying text.
2.  **Add `aria-label`:** For each identified icon-only button, add an `aria-label` attribute. The value of this label should be a concise, human-readable description of the button's action or purpose (e.g., "Delete item", "Edit item", "Add new item", "Sign out", "Toggle navigation").
3.  **Ensure Clarity:** The `aria-label` should be sufficient for a screen reader user to understand the button's functionality without needing visual context.

**Example:**

```diff
-<button onClick={handleDeleteItem}>
-  <TrashIcon />
-</button>
+<button onClick={handleDeleteItem} aria-label="Delete item">
+  <TrashIcon />
+</button>
```

### Acceptance Criteria

- All icon-only buttons in the application have an `aria-label` attribute.
- The `aria-label` values accurately describe the function of each button.
- The application builds and lints without errors.

### Required Test Commands

```bash
npm run build
npm run lint
```
