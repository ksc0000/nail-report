# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. The current state indicates that initial AI loop setup tasks are complete, and the first substantive development task is pending. This task will initiate the test coverage efforts for core utility functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. The focus is to ensure that critical Firestore operations performed by these helpers are correctly tested.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability, if necessary, e.g., exporting a non-exported helper function for testing purposes)
- `src/__tests__/firestore.test.ts` (new test file for unit tests)

## Forbidden Scope

- `src/main.
