```markdown
# Worker Prompt Template

## Context

The current focus is on Phase 2 of the roadmap, specifically improving accessibility (2.4). This task addresses a core accessibility requirement for interactive elements.

## Objective

Identify all icon-only buttons within the application and add an appropriate `aria-label` attribute to each, providing a descriptive text equivalent for assistive technologies.

## Allowed Scope

- `src/components/` (where icon buttons are likely defined)
- `src/pages/` (where icon buttons might be directly used)
- `src/App.css` (if minor styling adjustments are needed to accommodate accessibility, though unlikely for this task)
- Any other file in `src/` where icon-only buttons are found, except `src/main.tsx`.

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
- Prefer adding tests when touching `src/lib/` files. (Not applicable for this task, as it modifies UI components)
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---

## Worker Prompt

Implement the task as described in the "Objective" section.
You should:
1.  **Scan the codebase** for JSX elements that represent buttons which contain only an icon (e.g., `<button><Icon /></button>`).
2.  **Add an `aria-label` attribute** to each identified icon-only button. The value of the `aria-label` should clearly describe the button's action or purpose (e.g., `aria-label="Delete item"`, `aria-label="Edit tag"`).
3.  Ensure that the `aria-label` text is concise and accurately conveys the button's function.

**Acceptance Criteria:**
- All icon-only buttons throughout the application have a meaningful `aria-label` attribute.
- The application builds successfully (`npm run build`).
- There are no new linting errors (`npm run lint`).
```
