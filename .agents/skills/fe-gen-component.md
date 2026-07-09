# Skill: Generate Component (fe-gen-component)

This skill describes the workflow for generating a pixel-perfect React Native component from a selected Figma component/node export JSON.

## Workflow Execution Steps

When instructed to run `fe-gen-component <ComponentName>`, perform the following sequence:

### Step 1: Run Figma Export Script (Automated)
1. The agent must automatically run the following terminal command to export the selection:
   ```bash
   python3 test_figma_mcp.py --component <ComponentName>
   ```
2. Verify that a new versioned subdirectory has been created under `output/common/<component-name-kebab-case>/` (e.g., `output/common/input-field/input-field-1/` on the first run, and `output/common/input-field/input-field-2/` on subsequent runs) containing:
   - `layout.json` (the geometric-sorted component selection tree).
   - `screenshot.png` representing the design.
3. If the command fails (e.g., due to no selection on Figma Desktop), report the error to the user and prompt them to select the target component on Figma Desktop, then rerun the command.

### Step 2: Reuse Check, Multi-Variant Analysis & Extension Check
1. Look at existing files in `src/components/`.
2. Assess if the component or a similar one already exists:
   - If the component file already exists (e.g., `src/components/InputField.tsx`), **do NOT duplicate code** or overwrite the file.
   - Inspect the latest exported version (e.g., `input-field-2/` with the highest version suffix) alongside all previous versions (`input-field-1/`, etc.) to analyze the different design states, inputs, colors, and layout configurations.
   - **Extend the existing component**: Update its TypeScript props interface with optional properties (e.g., `variant?: 'default' | 'icon-right'`, `status?: 'default' | 'error' | 'active'`, `rightIcon?: IconType`), and merge/extend its styling using conditional stylesheet rules.
   - If the component does not exist yet, build the base implementation using the first version (`<component-name>-1`).

### Step 3: Decompose Complex Components
1. If the component is a complex aggregate (e.g., a multi-step card form or a dashboard layout component):
   - Decompose it into smaller child components under `src/components/`.
   - Each child component should be focused and self-contained.

### Step 4: Extract Assets
1. Check if the component contains custom vectors, logos, or icons.
2. Follow `asset-manager.md` to export new assets directly into `assets/icons/` or `assets/images/` and update registries.

### Step 5: Implement Component Code
1. Create/update the file directly under `src/components/` (e.g., `src/components/MyButton.tsx` or `src/components/my-button/MyButton.tsx`). Do **not** use a `src/components/ui/` folder.
2. Define strong TypeScript typings for props (**strictly do not use `any`**):
   ```typescript
   import { StyleProp, ViewStyle } from 'react-native';

   export interface MyButtonProps {
     title: string;
     onPress?: () => void;
     disabled?: boolean;
     style?: StyleProp<ViewStyle>; // Allow style overrides
   }
   ```
3. Use the `parse-layout.md` skill to map JSON boundaries, corner radiuses, paddings, shadows, and text parameters to `StyleSheet.create`.
4. Support layout overrides by combining parent-passed styles:
   ```typescript
   <View style={[styles.container, style]}>
   ```

### Step 6: Code Verification
1. Verify files with TypeScript compilation (`npx tsc --noEmit`) and linting (`npm run lint`).
2. Notify the developer that the component is ready. Staging and committing changes is handled entirely by the developer.
