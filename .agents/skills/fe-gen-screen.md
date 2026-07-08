# Skill: Generate Screen (fe-gen-screen)

This skill describes the workflow for generating a pixel-perfect React Native screen with Expo Router from a Figma export JSON.

## Workflow Execution Steps

When instructed to run `fe-gen-screen <screen-name>`, perform the following sequence:

### Step 1: Run Figma Export Script (Automated)

1. The agent must automatically run the following terminal command to export the selection:
   ```bash
   python3 test_figma_mcp.py --screen <screen-name>
   ```
2. Verify that the output directory `output/<screen-name-kebab-case>/` contains:
   - `layout.json` (the geometric-sorted node JSON for the screen).
   - `screenshot.png` representing the design.
3. If the command fails (e.g., due to no selection on Figma Desktop), report the error to the user and prompt them to select the target screen on Figma Desktop, then rerun the command.

### Step 2: Extract Styles & Theme

1. Read the styles file at `output/figma_styles.json`.
2. Parse typography and colors.
3. Execute the `style-mapper.md` skill to update or verify `src/constants/theme.ts`.

### Step 3: Extract Assets (Icons & Images)

1. Scan the screen JSON node recursively for icons, logos, and vector assets.
2. For each detected asset not already present in the workspace, execute the `asset-manager.md` skill to export and register it.

### Step 4: Decompose Screen Layout

1. Do not generate a single monolithic file for the screen.
2. Divide the screen vertically into major sections:
   - Header (e.g., `ExploreHeader.tsx`)
   - Scrollable Content Sections (cards, lists, buttons)
   - Bottom Action Bars (if any)
3. For each section, determine if it contains reusable components.

### Step 5: Reuse Check & Component Extraction

1. Search `src/components/` for any existing components that match the required sub-sections.
2. **Reusability Rule**:
   - If a matching component exists, import and reuse it.
   - If it differs slightly (e.g., color, size, text, margins, minor children), **do not rewrite it**. Modify the existing component's props/types to support optional parameters or a custom style override.
   - If no matching component exists, execute `component-extractor.md` to create it under `src/components/`.

### Step 6: Layout Assembly & Screen Construction

1. Create the screen file under `src/app/` (e.g., `src/app/<route>.tsx`) following `expo-router` routing structure and `naming-conventions.md`.
2. Follow `parse-layout.md` rules to translate coordinates, layout margins, alignments, and sizes into exact React Native `StyleSheet` values.
3. Import the shared theme, extracted sub-components, and registered assets.
4. Ensure layout wrappers use safe area contexts (`react-native-safe-area-context`) where needed.

### Step 7: Verification

1. Verify the layout: run TypeScript checking (`npx tsc --noEmit`) and linting (`npm run lint`).
2. Notify the developer that the screen is ready. Staging and committing changes is handled entirely by the developer.
