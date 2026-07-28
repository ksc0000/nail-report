# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses an item from Phase 2.4 Accessibility.

## Objective

Add `aria-label` attributes to all icon-only buttons in the application to improve accessibility for screen reader users.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/components/` (Likely location of most icon buttons)
- `src/App.css` (if minor styling adjustments are needed, though unlikely)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Identify all interactive elements that function as buttons but only contain an icon (e.g., `<button><FaIcon /></button>`).
- For each identified icon-only button, add an `aria-label` attribute that clearly describes the button's action (e.g., `aria-label="Delete item"`, `aria-label="Edit item"`, `aria-label="Upload image"`).
- Ensure the `aria-label` content is descriptive and contextually appropriate.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

Jules, your task is to iterate through the React components in the `src/` directory, focusing on `src/components/`. Identify all `<button>` elements that primarily contain an icon (e.g., from `react-icons`) and do not have visible text. For each such button, add a descriptive `aria-label` attribute.

**Example:**

**Before:**
```tsx
<button onClick={handleDelete}>
  <FaTrashAlt />
</button>
```

**After:**
```tsx
<button onClick={handleDelete} aria-label="Delete item">
  <FaTrashAlt />
</button>
```

Carefully consider the context of each button to provide an accurate and helpful `aria-label`. For instance, a trash icon button within a list of items should specify "Delete [item type]" if possible, or just "Delete" if generic.
After making changes, run `npm run build && npm run lint` to ensure no new errors or warnings are introduced.
