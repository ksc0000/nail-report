# Worker Prompt Template

## Context

The application is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses an accessibility improvement from section 2.4 of the roadmap.

## Objective

Identify all buttons in the application that contain only an icon (with no visible text label) and add an appropriate `aria-label` attribute to each of them. The `aria-label` should clearly describe the button's purpose or action for screen reader users.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/` helpers (firestore.ts, storage.ts, auth.ts, publicShares.ts)
- `src/__tests__/` (new test files)
- `src/App.css` (CSS improvements)

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
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

### Task: Add `aria-label` to all icon-only buttons

**Description:**
As part of improving the application's accessibility, locate all interactive button elements that display only an icon and lack a visible text label. For each identified button, add an `aria-label` attribute. The value of this `aria-label` must be a clear, concise, and descriptive string that conveys the button's function to screen reader users. For example, a trash icon button for deleting an item should have `aria-label="Delete item"`. Do not add any new visible text.

**Acceptance Criteria:**
1.  All icon-only buttons throughout the application have a well-chosen and descriptive `aria-label`.
2.  The `aria-label` values accurately reflect the button's action or purpose.
3.  No new visible text labels are introduced alongside or in place of the icons.
4.  The application's visual layout and functionality remain unchanged.

**Required Test Commands:**
```bash
npm install # Ensure all dependencies are installed
npm run build # Verify the application builds successfully
npm run lint # Ensure code style and quality standards are met
```
