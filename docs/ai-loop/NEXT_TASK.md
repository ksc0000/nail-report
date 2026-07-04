```markdown
# Worker Prompt Template

## Context

The `nail-report` application is currently in Phase 2, focusing on stability, test coverage, and UX improvements. This task specifically addresses Phase 2.4: Accessibility. Many icon-only buttons in the application currently lack descriptive text for screen readers, hindering accessibility.

## Objective

Identify all icon-only buttons throughout the application and add appropriate `aria-label` attributes to each to improve accessibility for users relying on screen readers.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- Specifically: Any `.tsx` or `.jsx` component files where icon buttons are rendered (e.g., `src/components/**/*.tsx`, `src/App.tsx`).

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
- For each icon-only button, add an `aria-label` attribute that clearly describes the button's action (e.g., `<button aria-label="Delete item">...</button>`).
- Ensure the `aria-label` text is concise and accurately reflects the button's function.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Implement the objective outlined above. Your task is to locate all interactive elements that consist solely of an icon (e.g., `<button><IconComponent /></button>`) and add a meaningful `aria-label` attribute to the button element. Focus on user-facing controls like edit, delete, add, sign out, or navigation buttons. Do not add `aria-label` to buttons that already contain visible text.

Example:
```tsx
// Before
<button onClick={handleDelete}>
  <TrashIcon />
</button>

// After
<button onClick={handleDelete} aria-label="Delete item">
  <TrashIcon />
</button>
```

Remember to run `npm run build && npm run lint` to verify your changes before completing the task.
```
