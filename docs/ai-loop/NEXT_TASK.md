# Worker Prompt Template

## Context

The AI Loop is in Phase 2 of the roadmap, focusing on improving stability, test coverage, and UX. This is the first substantive task for the worker agent. The goal is to improve accessibility by adding `aria-label` attributes to icon-only buttons, ensuring better support for assistive technologies.

## Objective

Add `aria-label` attributes to all icon-only buttons throughout the application to enhance accessibility.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/App.css` (for minor layout adjustments if necessary, but not the primary focus)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Identify all button elements that contain only an icon and no visible text label.
- Add a descriptive `aria-label` attribute to each identified button. The label should clearly convey the button's action (e.g., "Delete item", "Edit item", "Add tag").
- Ensure the diff remains ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

Implement the `aria-label` attributes as described in the Objective and Requirements sections. Focus on components that contain interactive buttons displaying only an icon.

**Acceptance Criteria:**

- All icon-only `<button>` elements in the application have a meaningful `aria-label` attribute.
- The application builds successfully (`npm run build`).
- The linter passes (`npm run lint`).

**Required Test Commands:**

```bash
npm run build
npm run lint
```
