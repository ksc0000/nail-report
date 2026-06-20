# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on stability, test coverage, and UX improvements. This task specifically addresses accessibility.

## Objective

Enhance accessibility by adding `aria-label` attributes to all icon-only buttons throughout the application.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/components/` (modifying existing React components)
- `src/App.css` (if minor layout adjustments are needed for accessibility, though unlikely)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Identify all `<button>` elements that contain only an icon and no visible text.
- Add a descriptive `aria-label` attribute to each identified button. The `aria-label` content should clearly convey the button's function (e.g., `aria-label="Delete item"`, `aria-label="Edit item profile"`).
- Ensure the `aria-label` values are user-friendly and concise.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Do not add any new npm dependencies.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
**Initial AI selection rationale**: This task aligns with "Phase 2.4 Accessibility" from the roadmap. It is a small, well-defined, and self-contained task that directly improves user experience for assistive technology users. It also strictly adheres to the "no-new-npm-deps" constraint and is expected to result in a small PR.
