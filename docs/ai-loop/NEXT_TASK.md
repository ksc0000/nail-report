# Worker Prompt

## Context

The `nail-report` application is currently in Phase 2 of its roadmap, focusing on improving stability, test coverage, and user experience. This task directly addresses accessibility, a key aspect of user experience, by ensuring that interactive elements are properly described for assistive technologies.

## Objective

Identify all icon-only buttons throughout the `nail-report` application and add appropriate `aria-label` attributes to enhance accessibility for screen reader users.

## Allowed Scope

- Any existing file within the `src/` directory that contains an icon-only button element or a component rendering such a button. This typically includes files in `src/components/`, `src/App.tsx`, and potentially other view/page components.
- Modifications are limited to adding `aria-label` attributes to `button` elements or their encapsulating components.

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Creation of new files (except for tests, but this task does not involve new tests).

## Requirements

- Systematically review the application's UI to locate all buttons that render solely an icon without visible text content (e.g., `<button><SomeIconComponent /></button>`).
- For each identified icon-only button, add a descriptive `aria-label` attribute that clearly communicates the button's purpose and action to a screen reader (e.g., `aria-label="Delete item"`, `aria-label="Edit report"`, `aria-label="Upload image"`).
- The `aria-label` should be concise and accurately reflect the button's functionality. Assume English descriptions are sufficient for now.
- The total line diff for the resulting pull request must be ≤ 150 lines.
- Before considering the task complete, ensure `npm run build && npm run lint` run without errors.
- Any challenges encountered (e.g., highly dynamic button labels, complex component structures) or potential follow-up items should be reported as comments in the pull request, not as additional code changes.
