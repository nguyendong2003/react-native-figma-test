# Skill: Git Guidelines & Workflow

This skill outlines the version control standards, branch naming rules, and commit message formats to follow in this repository.

## 1. Branch Naming Rules
Always create a branch from the main branch before working on a new task. Use lowercase kebab-case for descriptions.

- **Features (New screens, components, integrations)**:
  - Format: `feature/<screen-name-or-component-name>`
  - Examples: `feature/explore-screen`, `feature/primary-button`
- **Bugfixes (Fixes to layout, offset, broken styles)**:
  - Format: `bugfix/<brief-bug-description>`
  - Examples: `bugfix/text-overflow-android`, `bugfix/header-safe-area`
- **Refactoring (Decomposing components, performance cleanups)**:
  - Format: `refactor/<target-component>`
  - Examples: `refactor/input-fields`, `refactor/tabs-cleanup`

## 2. Commit Message Standards (Conventional Commits)
All commit messages must follow the Conventional Commits structure:
```
<type>(<scope>): <description>
```

### Allowed Types:
- `feat`: A new feature (e.g., adding a screen, generating a new component).
- `fix`: A bug fix (e.g., fixing layout offsets, resolving TypeScript compile errors).
- `style`: Changes that do not affect code logic (e.g., styling tweaks, formatting, updating the color palette in `theme.ts`).
- `refactor`: Code changes that neither fix a bug nor add a feature (e.g., extracting common components, splitting files).
- `docs`: Documentation modifications (e.g., updates to README, markdown instructions).
- `chore`: General maintenance (e.g., adding/modifying npm scripts, editing config files).

### Scope:
The scope should represent the specific module or screen affected. Keep it lowercase and short.
- Examples: `explore`, `header`, `button`, `icons`, `theme`, `lint`.

### Description:
- Use imperative, present tense (e.g., "add", "fix", "update" instead of "added", "fixed", "updates").
- Use lowercase.
- Do not add a period at the end.

### Examples:
- `feat(explore): add pixel-perfect screen layout`
- `feat(icons): export unfold-more svg icon from figma`
- `refactor(button): extract custom primary button component`
- `style(theme): map Neutral/4 color to secondary tokens`
- `fix(input): correct horizontal spacing in text field`
