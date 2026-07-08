# Skill: Figma Style to Theme Mapper

This skill details how to map exported Figma design styles (colors, typography, shadow effects) into the project's centralized theme system in `src/constants/theme.ts` and styling variables in `src/global.css`.

Before running the mapper, the agent must follow these rules regarding the styles file:
1. **Check file existence**: Check if `output/figma_styles.json` exists.
2. **Use Cached File**: If the file exists, read it directly. Do **NOT** execute the python script to download styles.
3. **Ask before running**: If the file does **NOT** exist, ask the user in the chat: *"The styles file output/figma_styles.json is missing. Should I run python3 test_figma_mcp.py --styles to fetch it?"*. Only execute the command if the user approves.
4. **Explicit Refresh**: If the user explicitly requests to *"update styles"* or *"refresh theme"*, bypass the cache and run the command to overwrite the file:
   ```bash
   python3 test_figma_mcp.py --styles
   ```

---

## 1. Color Palette Mapping (Paint Styles)

Figma paint styles represent solid colors, gradients, or image fills. Scan the paint styles list (e.g. `output/figma_styles.json`) and extract hex codes.

### Naming & Token Conversion
Convert Figma style slash-separated names into camelCase object keys:
- `Primary / 1` $\rightarrow$ `primary1` (or `primary` in theme)
- `Neutral / 4` $\rightarrow$ `neutral4` (or `neutral4` / `placeholder` in theme)
- `Black — Inactive` $\rightarrow$ `blackInactive`

**Usage mapping from JSON**:
- When a node contains **`fillStyle: "<StyleName>"`** (e.g., `fillStyle: "Neutral/4"`):
  - Translate the name to camelCase (e.g., `neutral4`).
  - Access it in StyleSheet via `Colors.light.neutral4` (or `Colors.light.placeholder` if mapped to semantic names).
- When a node contains **`textStyle: "<StyleName>"`** (e.g., `textStyle: "Body / 3"`):
  - Translate the name to camelCase (e.g., `body3`).
  - Apply it in StyleSheet using `...Typography.body3`.

### Update `src/constants/theme.ts`
Add the extracted colors into `Colors.light` and `Colors.dark` or define a brand palette:
```typescript
export const FigmaColors = {
  primary1: '#3629b7',
  neutral4: '#cacaca',
  blackInactive: '#0000008a',
  white: '#ffffff',
  borderLight: '#cbcbcb',
} as const;
```
For semantic mappings, map theme keys to these colors:
```typescript
export const Colors = {
  light: {
    primary: FigmaColors.primary1,
    border: FigmaColors.borderLight,
    placeholder: FigmaColors.neutral4,
    // ... other mappings
  },
  dark: {
    primary: FigmaColors.primary1,
    border: '#444444',
    placeholder: '#555555',
    // ... other mappings
  }
}
```

### Update `src/global.css`
Also define the extracted color variables under the `:root` selector in `src/global.css`. Use kebab-case format starting with `--color-` prefix:
- `Primary / 1` $\rightarrow$ `--color-primary-1: #3629b7;`
- `Neutral / 4` $\rightarrow$ `--color-neutral-4: #cacaca;`

```css
:root {
  /* ... existing variables */
  --font-poppins: Poppins, sans-serif;

  /* Figma Colors mapped to CSS Variables */
  --color-primary-1: #3629b7;
  --color-neutral-4: #cacaca;
}
```

---

## 2. Typography Presets Mapping (Text Styles)

Extract text styles (font size, weight, line-height, alignment) and map them to standard React Native style objects under a `Typography` constant.

### Text Style Name Mapping
- `Body / 3` $\rightarrow$ `body3`
- `Caption / 1` $\rightarrow$ `caption1`
- `Heading / 2` $\rightarrow$ `heading2`

### Conversion Rules
- **fontFamily**: Map custom weight fonts directly to their loaded file name strings to ensure compatibility (especially on Android). For Poppins, map to the specific weight-specific font family name:
  - `Poppins` + `Regular` / `400` $\rightarrow$ `fontFamily: 'Poppins-Regular'`
  - `Poppins` + `Medium` / `500` $\rightarrow$ `fontFamily: 'Poppins-Medium'`
  - `Poppins` + `SemiBold` / `600` $\rightarrow$ `fontFamily: 'Poppins-SemiBold'`
  - `Poppins` + `Bold` / `700` $\rightarrow$ `fontFamily: 'Poppins-Bold'`
  - `Poppins` + `Black` / `900` $\rightarrow$ `fontFamily: 'Poppins-Black'`
- **fontWeight**: **Do NOT** specify the `fontWeight` property when using weight-specific custom fonts (like Poppins), as the weight is already handled by the custom font family itself.
- **lineHeight**: If unit is percent, calculate value: `Math.round(fontSize * (percentValue / 100))`.

### Output in `theme.ts`
Extend `src/constants/theme.ts` to export a `Typography` object:
```typescript
export const Typography = {
  body3: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    lineHeight: 21,
  },
  caption1: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    lineHeight: 16,
  },
} as const;
```
```

---

## 3. Styling Application inside Components

When generating components, enforce using theme constants instead of hardcoded strings:
- **Incorrect**:
  ```typescript
  text: {
    color: '#3629b7',
    fontSize: 12,
    fontWeight: '600',
  }
  ```
- **Correct**:
  ```typescript
  text: {
    ...Typography.caption1,
    color: Colors.light.primary, // or dynamic coloring based on color scheme
  }
  ```
- Use the `useColorScheme()` hook from `src/hooks/use-color-scheme.ts` to dynamically resolve colors if light/dark modes are supported:
  ```typescript
  const theme = useColorScheme() ?? 'light';
  const activeColors = Colors[theme];
  ```
