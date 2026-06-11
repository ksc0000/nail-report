# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on stability, test coverage, and UX. This task addresses a key item in the accessibility improvements (Phase 2.4). The current state requires small, bounded tasks without adding new npm dependencies.

## Objective

Enhance accessibility by identifying all icon-only interactive elements (buttons, links) within the application and adding appropriate `aria-label` attributes to them.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/components/` (modifying existing component files)
- `src/pages/` (modifying existing page files)
- `src/App.tsx`

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Locate all `button` or `a` elements that visually represent an action primarily through an icon, without visible text.
- Add a descriptive `aria-label` attribute to these elements. The value of `aria-label` should clearly articulate the purpose or action of the element to assistive technologies (e.g., "Delete item", "Edit profile", "Share link", "Add new nail report").
- Prioritize elements that are interactive and crucial for navigation or core functionality (e.g., CRUD actions, navigation buttons, share buttons).
- Ensure the `aria-label` content is concise, accurate, and user-friendly.
- Keep the overall diff for this task under 150 lines.
- Run `npm run build && npm run lint` before finishing to ensure code quality.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
