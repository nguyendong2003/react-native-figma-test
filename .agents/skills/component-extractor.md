# Skill: Reusable Component Extractor

This skill details how to analyze UI designs, identify repeated patterns, extract reusable components under `src/components/`, and implement customization strategies instead of duplicating code.

---

## 1. Pattern Detection & Extraction Criteria

Scan screen/component exports (e.g., `layout.json` inside the screen or common component directories) to find elements that should be extracted:
- **Buttons**: A `RECTANGLE` (representing a background/border) nested with `TEXT` and optional `VECTOR`/`INSTANCE` (representing icons).
- **Text Inputs**: A border `RECTANGLE` with a placeholder `TEXT`, an active value `TEXT`, or helper caption/labels.
- **List Items / Cards**: Repetitive elements in lists (e.g., card item with avatar, title, description, and chevron icon).
- **Page Headers**: Section containing page title, back button, and actions.

When a layout subtree matches these criteria and repeats (or is likely to be reused in other screens), extract it into a standalone file directly in `src/components/` (e.g., `src/components/TextField.tsx`).

---

## 2. Component Structure Guidelines

All extracted components must be written with the following rules:
- **Strong Typings**: Declare a clear TypeScript interface for props.
- **Customizable Layout (Props)**: Support passing dynamic values rather than hardcoding contents:
  ```typescript
  import { StyleProp, ViewStyle, TextStyle } from 'react-native';

  export interface ButtonProps {
    title: string;
    onPress?: () => void;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
    titleStyle?: StyleProp<TextStyle>;
  }
  ```
- **Style Merging**: Always merge the internal component stylesheet with parent-passed styles using array notation:
  ```typescript
  export function Button({ title, onPress, disabled, style, titleStyle }: ButtonProps) {
    return (
      <TouchableOpacity 
        onPress={onPress} 
        disabled={disabled} 
        style={[styles.buttonContainer, style]}
      >
        <Text style={[styles.buttonText, titleStyle]}>{title}</Text>
      </TouchableOpacity>
    );
  }
  ```

---

## 3. Component Reuse & Customization Strategy

Before writing a new component, scan the files in `src/components/`. If a similar component is present, follow these steps to reuse and extend it:

### Rule: Expand, Do Not Duplicate
If the target design differs slightly (e.g., different background color, borders, trailing icon, font weight):
1. **Do not create a new component file.**
2. **Do not copy-paste code.**
3. **Extend the existing component**:
   - Add optional props to the existing interface (e.g. `variant?: 'outline' | 'filled'`, `error?: string`, `rightIcon?: IconType`).
   - Add conditional styles based on these props:
     ```typescript
     const containerStyles = [
       styles.baseContainer,
       variant === 'outline' ? styles.outlineVariant : styles.filledVariant,
       error ? styles.errorBorder : null,
       style,
     ];
     ```
   - Render optional sub-nodes conditionally:
     ```typescript
     {rightIcon && <CustomIcon name={rightIcon} size={20} />}
     ```
   - This keeps the component code unified and bug-free across all screens.

---

## 4. Mapping Figma INSTANCE Nodes to React Components

When parsing a screen `layout.json`, you will encounter nodes of type `INSTANCE` (e.g., `"name": "Text field / Default - Icon right"`).
- **Rule**: Do **NOT** recreate the nested layout from scratch in the screen file. Instead, map the `INSTANCE` to a React component import.

### How to Extract Props from Instance Children
1. **Identify the Component**: Map the `INSTANCE` node name to the corresponding component (e.g., `"Text field / Default"` or `"Text field / Default - Icon right"` $\rightarrow$ `<TextField />`).
2. **Scan Children for Props**:
   - **Label/Placeholder**: A child node of `type: "TEXT"` named `"Password"` or `"Text input"` has `characters` that represent the component's `placeholder`, `label`, or initial `value`.
   - **Icon**: A child representing an icon (e.g. named `"Icon"` containing an instance of `"icons/down-arrow 2"`) maps to `rightIcon="downArrow"` (based on `asset-manager.md` exports).
   - **Helper/Caption**: A child node of `type: "TEXT"` named `"Caption"` maps to `helperText` or `errorText`.
3. **Write the Component Mapping**:
   ```typescript
   // Maps directly to:
   <TextField
     label="Password"
     placeholder="Password"
     rightIcon="downArrow"
     helperText="Caption"
   />
   ```

### Implementation Rules for Component Generation
If the `<TextField>` component does not exist and you need to generate it:
1. Examine the children of the `INSTANCE` node in `layout.json` to build the internal component code.
2. Group the outer input wrapper using Flexbox (e.g., input border, text, and right icon horizontally in a row with `justifyContent: 'space-between'` and `alignItems: 'center'`).
3. Position the Caption/Error message vertically below the input row if its relative coordinates stack it vertically.
