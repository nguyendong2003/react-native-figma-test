# Skill: Naming Conventions

This skill defines the naming standards across the project to maintain code consistency and readability.

## 1. Directory Names
- Use **kebab-case** (all lowercase, words separated by hyphens) for folder names.
- Examples:
  - `src/components/`
  - `assets/icons/`
  - `assets/images/`

## 2. File Names
- **Expo Router Screens (`src/app/`)**: Use **kebab-case** to match URL routing standards (e.g., `index.tsx`, `profile-settings.tsx`, `search-results.tsx`).
- **React Components (`src/components/`)**: Use **PascalCase** (e.g., `AppTabs.tsx`, `ThemedText.tsx`, `ExploreHeader.tsx`).
- **Custom Hooks (`src/hooks/`)**: Prefix with `use-` and use **kebab-case** (e.g., `use-color-scheme.ts`, `use-debounce.ts`).
- **Constants, Themes, Utilities**: Use **kebab-case** or **camelCase** (e.g., `theme.ts`, `color-helper.ts`).

## 3. Component & Type Names
- **Component Declaration**: Use **PascalCase** matching the file name (e.g., `export function ExploreHeader() {}`).
- **TypeScript Props and Interfaces**: Use **PascalCase** suffixed with `Props` or `State` (e.g., `export interface ExploreHeaderProps {}`).

## 4. Functions and Variables
- **Functions**: Use **camelCase** and start with a verb describing the action.
  - Examples: `handlePress`, `onSubmit`, `fetchUserData`, `calculateLayoutOffset`.
- **Variables**: Use **camelCase** for local variables and hooks.
  - Examples: `selectedId`, `isSubmitting`, `textColor`.
- **Constants**: Use **UPPER_CASE** with underscores for static configuration constants.
  - Examples: `DEFAULT_PADDING`, `MAX_RETRIES`, `BASE_URL`.

## 5. StyleSheet Rule Names
- In React Native `StyleSheet.create`, use **camelCase** keys.
- Avoid generic, numbering names (e.g., `style1`, `box2`). Use semantic names representing the layout role.
- Examples:
  - `container` (outer wrapper)
  - `headerText`
  - `activeTabIcon`
  - `buttonLabel`
  - `cardWrapper`

## 6. TypeScript & Typing Rules
- **Strictly No `any`**: Do NOT use the `any` type under any circumstances.
- **Explicit Types**: Always write explicit types/interfaces for component props, hook returns, function parameters, and return types.
- **Dynamic or Unknown Types**: If a type is dynamic or unknown, use TypeScript generics, union types, or `unknown` (coupled with appropriate type guards or assertions).

