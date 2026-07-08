# Figma to React Native Code Generation Guidelines

This document explains how to utilize the custom developer workflows and agent skills stored in the `.agents/skills` folder to automate the conversion of Figma designs into pixel-perfect React Native screens and components (using Expo Router and `StyleSheet`).

---

## 1. Directory of Agent Skills (`.agents/skills/`)

The layout generation pipeline is guided by 8 coordinated skill files:
1. **[fe-gen-screen.md](.agents/skills/fe-gen-screen.md)**: Coordinates the high-level workflow for generating new screen layouts.
2. **[fe-gen-component.md](.agents/skills/fe-gen-component.md)**: Coordinates the high-level workflow for generating reusable components.
3. **[naming-conventions.md](.agents/skills/naming-conventions.md)**: Defines naming standards (files, folders, variables, stylesheet rules) and TypeScript typing practices.
4. **[git-guidelines.md](.agents/skills/git-guidelines.md)**: Enforces Git branching conventions and Conventional Commit formats.
5. **[parse-layout.md](.agents/skills/parse-layout.md)**: Explains coordinate translation, Flexbox row/column parsing, and layout spacing math.
6. **[style-mapper.md](.agents/skills/style-mapper.md)**: Details mapping color (`fillStyle`) and text (`textStyle`) tokens from Figma to the project theme.
7. **[asset-manager.md](.agents/skills/asset-manager.md)**: Automates image/icon exports (SVG/PNG) from Figma and registers them in the asset registries.
8. **[component-extractor.md](.agents/skills/component-extractor.md)**: Governs layout decomposition, component mapping, and the component reuse rules.

---

## 2. Developer Workflow & Chat Command Execution

All code generation is executed by **prompting the AI Agent in the chat UI**. The agent will automatically call the Python export script to fetch assets/metadata from Figma on your behalf.

### Step 1: Initialize the Design System & Colors (Theme Setup)
1. **Trigger Word**: Type this in the chat:
   > *"Run style-mapper"* or *"Update theme.ts from Figma"*
2. **How it works**:
   - The agent checks if the styles file `output/figma_styles.json` exists.
   - If the file **exists**, the agent reads it directly to update `src/constants/theme.ts` without executing the Python export script (saving Figma API calls).
   - If the file **does NOT exist**, the agent stops and prompts you: *"The styles file output/figma_styles.json is missing. Should I run python3 test_figma_mcp.py --styles to fetch it?"*. The agent will only execute the script if you approve.
   - If you want to force a fresh styles download, type: *"Update shared styles from Figma"* or *"Refresh styles"*.

---

### Step 2: Create Reusable Components (Buttons, Inputs, Cards...)
1. **Action**: Open Figma Desktop and select (Select) only the target element frame.
2. **Trigger Word**: Type this in the chat:
   > *"fe-gen-component <component-name>"*
   >
   > *(Example: `fe-gen-component primary-button`)*
3. **How it works**:
   - The agent automatically executes the terminal command: `python3 test_figma_mcp.py --component primary-button`.
   - The script saves selection properties to `output/common/primary-button/layout.json` and exports a PNG screenshot.
   - The agent parses the layout, extracts SVG assets to `assets/icons/`, registers the files, and creates `src/components/PrimaryButton.tsx`.

---

### Step 3: Create Full Screens (Login, Home, Explore...)
1. **Action**: Open Figma Desktop and select (Select) only the target Screen frame.
2. **Trigger Word**: Type this in the chat:
   > *"fe-gen-screen <screen-name>"*
   >
   > *(Example: `fe-gen-screen explore`)*
3. **How it works**:
   - The agent automatically executes: `python3 test_figma_mcp.py --screen explore`.
   - The script saves design metadata to `output/explore/layout.json` and exports a PNG screenshot.
   - The agent decomposes the layout, scans for existing reusable components, loads typography presets, and writes the screen layout in `src/app/explore.tsx`.
   - The agent runs typecheck validation (`npx tsc --noEmit`) and commits all changes automatically using Conventional Commit standards.

---

## 3. Critical Coding Standards & Best Practices

To maintain code quality, the agent strictly enforces the following policies during generation:

* **Strictly No `any`**: The use of `any` in TypeScript is prohibited. Every parameter, variable, return value, and component prop must be explicitly and strictly typed.
* **Component Reuse over Code Duplication**: When generating elements, if a matching component exists in `src/components/`, the agent will reuse it or extend its props/types (supporting optional fields or custom stylesheet overrides) instead of copy-pasting code or creating duplicate files.
* **Poppins Custom Font Handling**:
  - The Poppins font weights are preloaded in the root layout `src/app/_layout.tsx`.
  - In StyleSheet styles, the agent must map font settings directly to the weight-specific font family string (e.g. `fontFamily: 'Poppins-SemiBold'`) and **exclude the `fontWeight` property entirely** to ensure cross-platform compatibility (especially on Android).
* **Component Folder Path**: All components must be saved directly under `src/components/`. The agent will **never** write files to a `src/components/ui/` directory.
