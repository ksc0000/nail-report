\# AI Coding Conventions



\## Scope

\- This project is a React + TypeScript + Vite app.

\- AI agents must keep changes small and focused.

\- Do not modify files unrelated to the requested task.



\## Protected Files

Do not modify these files unless explicitly instructed:

\- package.json

\- package-lock.json

\- src/main.tsx

\- public/

\- dist/

\- assets/



\## React Rules

\- src/App.tsx is a React component.

\- Do not write createRoot, StrictMode, or ReactDOM rendering code in src/App.tsx.

\- Do not remove existing Todo functionality unless explicitly requested.

\- Preserve existing behavior before changing UI.



\## CSS Rules

\- Use normal CSS selectors only.

\- Do not write JavaScript expressions inside CSS.

\- Do not use styled-components syntax in .css files.

\- Use className in React and CSS selectors in App.css.



\## Validation

Before considering work complete:

\- Run npm run build.

\- Show git diff.

\- Summarize changed files.

