```markdown
# Worker Prompt Template

## Context

The current phase is "2.0" of the roadmap, focusing on improving stability, test coverage, and UX. No substantive feature tasks have been completed by the AI Loop yet. This task addresses Phase 2.4, specifically accessibility improvements.

## Objective

Implement accessibility improvements by adding `aria-label` attributes to all icon-only buttons in the application.

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
- Prefer adding tests when touching `src/lib/` files. (Not applicable for this UI task).
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---

## Worker Prompt

Your task is to improve the accessibility of the `nail-report` application by adding `aria-label` attributes to all interactive buttons that contain only an icon and no visible text.

**Acceptance Criteria:**

1.  **Identify Icon-Only Buttons:** Scan all `.tsx` files within the `src/` directory to locate `button` elements that currently display only an icon (e.g., SVG, `<img>` element, or a visual icon component) without any visible text directly accompanying it.
    *   Examples of such buttons might include delete buttons, edit buttons, share buttons, or navigation icons.
2.  **Add `aria-label`:** For each identified icon-only button, add a descriptive `aria-label` attribute.
    *   The value of the `aria-label` should clearly and concisely describe the button's action or purpose to assistive technologies (e.g., "Delete item", "Edit nail report", "Share public link", "Sign out", "Upload image").
3.  **No `aria-label` for Text Buttons:** Do *not* add `aria-label` to buttons that already contain visible text content or an `aria-labelledby` attribute referencing visible text.
4.  **Functional and Visual Integrity:** Ensure that the application's visual appearance and functionality remain unchanged after your modifications.
5.  **Smallest Change First:** Prioritize adding `aria-label` to buttons within key components like `NailItemCard`, `Navbar`, or forms, if applicable.

**Example:**

```tsx
// Before
<button onClick={handleDelete}>
  <TrashIcon />
</button>

// After
<button onClick={handleDelete} aria-label="Delete nail item">
  <TrashIcon />
</button>
```

**Required Test Commands:**

```bash
npm run build
npm run lint
```
```
