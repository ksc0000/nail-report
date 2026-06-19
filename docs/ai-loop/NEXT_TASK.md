# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on stability, test coverage, and UX improvements. This includes enhancing accessibility. The AI Loop has recently been set up and is now ready for its first substantive development task.

## Objective

Implement exactly one bounded task from Phase 2.4 (Accessibility) of the roadmap: Add `aria-label` attributes to all icon-only interactive elements (buttons, links that function as buttons) throughout the application.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/components/` (modifying existing components to add `aria-label`)
- `src/App.css` (minor adjustments if needed, but primarily HTML attribute changes)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Identify all HTML `<button>` or `<a>` elements that visually present only an icon (e.g., using `<FontAwesomeIcon />`) and lack visible text.
- Add a descriptive `aria-label` attribute to each identified element.
- The `aria-label` text should clearly describe the action or purpose of the button/link for assistive technologies (e.g., "Edit item", "Delete image", "Add new tag").
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files. (Not applicable for this task as no `src/lib` files are being modified).
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
