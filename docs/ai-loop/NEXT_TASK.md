# Worker Prompt Template

## Context

The `nail-report` application is currently in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. Specifically, Phase 2.1 aims to enhance test coverage, starting with unit tests for Firebase helper functions. Vitest has been chosen as the test runner, and it is assumed to be already installed and configured as a dev dependency.

This task is to begin implementing unit tests for selected helper functions located in `src/lib/firestore.ts`.

## Objective

Add initial unit tests for `addNailItem` and `getNailItems` helper functions within `src/lib/firestore.ts` using Vitest, ensuring Firebase SDK dependencies are mocked.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability, e.g., exporting unexported helpers or introducing dependency injection points if strictly necessary and small)
- `src/__tests__/firestore.test.ts` (new file for unit tests)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` (DO NOT add new `npm install` dependencies. If `vitest` test script is missing, add it, but do not change `dependencies` or `devDependencies`.)
- `vite.config.ts` (assume Vitest is already configured for mocking)
- Firebase deploy commands
- Secrets and credentials
- Any other files not explicitly allowed.

## Requirements

- **Diff Limit**: Keep the total diff ≤ 150 lines. Focus on testing 1-2 core functions initially.
- **New Test File**: Create a new file: `src/__tests__/firestore.test.ts`.
- **Target Functions**: Write unit tests for `addNailItem` and `getNailItems` from `src/lib/firestore.ts`.
- **Mocking**: Mock Firebase SDK functions (e.g., `addDoc`, `getDocs`, `collection`, `query`) using `vi.mock` to isolate the logic within `firestore.ts` and prevent actual Firebase calls.
- **Test Commands**: Before completing the task, run the following commands and ensure they pass:
    - `npm run build`
    - `npm run lint`
    - `npm test` (or the equivalent command configured for Vitest, e.g., `vitest run`)
- **Follow-up**: If any follow-up items are identified (e.g., testing more functions, broader mocking strategy), mention them as comments in your PR description.

## Output Format

Please provide your output in the following Markdown format:

```markdown
### Summary

[A brief description of the changes made.]

### Changed Files

- `path/to/file1.ts`
- `path/to/file2.ts`

### Commands Run and Results

```bash
npm run build
# [Output]

npm run lint
# [Output]

npm test
# [Output]
```

### Known Issues or Limitations

[Any known issues or limitations with the implemented solution.]

### Suggested Next Task

[Suggest the next logical task based on the roadmap and current changes. This will often be another small, bounded task.]
```
