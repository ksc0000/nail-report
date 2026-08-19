# Worker Prompt Template

## Context

The `nail-report` application is currently in Phase 2 of its roadmap, focusing on improving stability, test coverage, and user experience. This task specifically addresses Phase 2.4: Accessibility, by enhancing keyboard navigation and screen reader support for interactive elements.

## Objective

Identify all icon-only buttons throughout the application and add an appropriate `aria-label` attribute to each, describing its function.

## Allowed Scope

- `src/` directory (excluding `src/main.tsx`)
- Specifically, component files within `src/components/` and potentially `src/App.tsx` where icon-only buttons might be used.

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
- Ensure the `aria-label` provides a clear and concise description of the button's action for screen reader users (e.g., "Delete item", "Edit tag", "Share item").
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---

## Worker prompt

Implement the following task:

**Identify all icon-only buttons in the application and add a descriptive `aria-label` attribute to each.**

For example:
If a button looks like `<button><img src="delete.svg" alt="Delete"/></button>`, change it to `<button aria-label="Delete item"><img src="delete.svg" alt="Delete"/></button>`.
If it uses an icon library (e.g., Material Icons), ensure the `aria-label` is on the `<button>` element itself.

Focus on buttons that primarily convey their action through an icon, without visible text.

### Acceptance Criteria:
- All interactive icon-only buttons (e.g., delete, edit, add, sort, share, close) have an `aria-label` attribute.
- The `aria-label` accurately describes the button's function.

### Required test commands:
```bash
npm run build
npm run lint
```
