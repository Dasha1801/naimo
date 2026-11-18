# Naimo Project Rules & Context

## ⚡ AI Agent Efficiency Rules

### File Access (CRITICAL)

- NEVER scan the entire project.
- NEVER recursively list all project directories.
- NEVER read all files to understand the project.
- Only inspect files directly related to the current task.
- Do not guess file paths. Check the parent directory before accessing unknown files.
- Read the minimum amount of code necessary.
- Do not repeatedly retry failed file operations.
- If a file does not exist, report the error and stop.

### Task Scope

- Focus strictly on the user's current request.
- Do not perform additional analysis or refactoring unless requested.
- Do not inspect unrelated modules.
- Prefer targeted changes over broad modifications.
- Do not create unnecessary files.
- Do not generate project-wide reports unless explicitly requested.

### Token & Resource Efficiency

- Keep responses concise.
- Avoid repeating project context.
- Do not generate unnecessary plans or todo lists.
- Do not read large files when a smaller relevant section is sufficient.
- Avoid unnecessary tool calls.

### Safety

- Never modify files outside the scope of the requested task.
- Before making changes to multiple files, explain why each file needs modification.

## 🎯 Project Overview

Naimo is an AI-powered job aggregator platform. It fetches vacancies from external APIs (RemoteOK, HH.ru), stores them locally, and uses AI to score and summarize them.

## 🛠 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Compiler:** Turbopack (strict mode, no dynamic requires)
- **Language:** TypeScript (strict mode)
- **Styling:** SCSS Modules + Radix UI primitives. NO Tailwind.
- **State Management:** TanStack Query (React Query) for server state.
- **Database:** SQLite via Drizzle ORM + better-sqlite3.
- **Formatting:** Prettier (2 spaces, single quotes, semicolons, LF).

## 📁 Architecture Rules

### 1. File & Folder Structure

- Components: `src/components/ComponentName/ComponentName.tsx` + `ComponentName.module.scss`.
- **NO** `index.ts` barrel files for components unless absolutely necessary.
- API Routes: `src/app/api/[resource]/route.ts`.
- DB Schema: `src/lib/db/schema.ts`. DB Client: `src/lib/db/index.ts`.

### 2. Styling (CRITICAL)

- **ALWAYS use SCSS Modules** for component styling.
- **NEVER** import global SCSS files inside components (only in `src/app/layout.tsx`).
- **NEVER** use inline styles (`style={{ ... }}`) unless for dynamic runtime values. Use CSS variables from `globals.scss`.
- Use Radix UI for accessible, headless interactive components (Dialog, Dropdown, Tooltip).

### 3. Data Fetching & State

- Use Server Components for initial data loading where possible.
- Use `useQuery` from TanStack Query for client-side data fetching and caching.
- API routes must return JSON via `NextResponse.json()`.

### 4. Database (Drizzle ORM)

- Always use the exported `db` instance from `@/lib/db`.
- Import schema from `@/lib/db/schema`.
- Use `onConflictDoNothing()` or `onConflictDoUpdate()` for upserts to prevent duplicates.

## 🎨 Code Style

- 2 spaces indentation.
- Single quotes for strings.
- Semicolons at the end of statements.
- LF line endings.
- PascalCase for components, camelCase for functions/variables.
- Prefix external API IDs with source name (e.g., `remoteok:123`) to avoid collisions.

## 🚫 Anti-Patterns to Avoid

- Do not use `any` in TypeScript. Use proper interfaces/types.
- Do not create global CSS classes for specific components.
- Do not mix Tailwind classes with SCSS modules.
- Do not use `useState` for server data; use TanStack Query.
