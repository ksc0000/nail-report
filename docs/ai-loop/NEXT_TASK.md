# Worker Prompt Template

## Context

The nail-report application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task contributes to the Accessibility goal (2.4).

## Objective

Add `aria-label` attributes to all icon-only buttons throughout the application to improve accessibility for screen reader users.

## Allowed Scope

- `src/` (excluding `src/main.tsx`)
- Specifically, component files in `src/components/` and potentially `src/App.tsx` where icon buttons are rendered.
- `src/App.css` (only if absolutely necessary for layout adjustments related to labels, but should not be the primary focus).

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Identify all button elements that contain only an icon (e.g., `<button><Icon /></button>`) and do not have visible text.
- Add a descriptive `aria-label` attribute to these buttons. The label should clearly communicate the button's purpose (e.g., `aria-label="Delete item"`, `aria-label="Edit item"`, `aria-label="Upload image"`).
- Ensure the `aria-label` text is localized if the app supports multiple languages (for this task, assume English for simplicity, but consider how it would be translated).
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files (not applicable for this UI-focused task).
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
