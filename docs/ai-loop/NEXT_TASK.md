```markdown
# Worker Prompt Template

## Context

The team is actively working on Phase 2 of the roadmap, focusing on improving stability, test coverage, and UX. This task addresses a specific accessibility improvement from Phase 2.4.

## Objective

Add `aria-label` attributes to all icon-only buttons throughout the application to improve accessibility for screen reader users.

## Allowed Scope

- `src/` (excluding `src/main.tsx`)
- `src/components/` (modifying existing component files to add `aria-label` attributes)
- `src/App.tsx` (if any top-level buttons need modification)
- `src/lib/` (read-only for identifying button usage patterns, no modifications expected)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Identify all `<button>` elements that contain only an icon (e.g., `<img src="..." alt="icon description" />`, `<svg>...</svg>`, or a CSS-based icon) and add an appropriate, descriptive `aria-label` attribute.
- The `aria-label` text should clearly describe the button's action (e.g., "Delete item", "Edit tag", "Share post").
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files (not applicable for this UI-focused task).
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---

## Worker prompt

Implement the objective described above. Focus on identifying buttons that lack visible text but perform an action, and add a meaningful `aria-label`.

**Acceptance Criteria:**
1.  All icon-only buttons in the application have a descriptive `aria-label` attribute.
2.  The application builds successfully (`npm run build`).
3.  Linter passes (`npm run lint`).

**Required Test Commands:**
```bash
npm install
npm run build
npm run lint
```
```
```
