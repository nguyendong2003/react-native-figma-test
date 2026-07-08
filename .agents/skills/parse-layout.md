# Skill: Figma Geometry to React Native Flexbox Parser

This skill instructs the agent on how to translate coordinate-based Figma node structures (width, height, x, y coordinates) into a clean, modern React Native Flexbox layout using `StyleSheet` for pixel-perfect results.

---

## 1. Coordinate System & Relative Positioning

In the exported Figma selection JSON (`layout.json`):
- **Root Node**: The top-level node has absolute coordinates `(x, y)` representing its position in the Figma artboard.
- **Nested Child Nodes**: All child nodes have `(x, y)` coordinates **relative** to their immediate parent container (where the parent's top-left corner is `(0, 0)`).
- **Rule**: When calculating margins, paddings, and absolute positioning of a child, **always use its relative `(x, y)` bounds** directly as it maps to the parent's container space.

---

## 2. Flexbox Direction & Layout Rules

Figma designs use absolute coordinates. React Native uses Flexbox. To map absolute bounds to Flexbox, analyze sibling elements in the sorted JSON tree (which is ordered vertically first, then horizontally).

### Column vs. Row Detection
For a list of sibling nodes:
- **Row Detection (`flexDirection: 'row'`)**:
  - Compare the vertical center-Y coordinates of consecutive siblings (`center_y = y + height/2`).
  - If sibling nodes have the same (or within 4px after rounding) center-Y coordinates, group them into a Row.
  - Set `flexDirection: 'row'` on their parent wrapper.
  - **Vertical Alignment**: If children have different heights, align them vertically using `alignItems: 'center'` (default if they align in design) or `'flex-start'` / `'flex-end'`.
  - **Horizontal Alignment (`justifyContent`)**:
    - If the first child starts at the left edge (`x = paddingLeft`) and the last child ends at the right edge (`x + width = parent_width - paddingRight`), use `justifyContent: 'space-between'` if there are no other children, or if they are distributed evenly.
    - If the children are grouped together, use `justifyContent: 'flex-start'` (left-aligned), `'flex-end'` (right-aligned), or `'center'` (centered).
- **Column Detection (`flexDirection: 'column'`)**:
  - Sibling nodes that have distinct center-Y coordinates represent items stacked vertically.
  - Set `flexDirection: 'column'` (default in React Native) on their parent wrapper.

### Stretching & Dynamic Flex
- If a child node (such as a text input, search bar, or mid-screen divider) expands to fill the remaining horizontal space in a Row:
  - Do **not** use a hardcoded width.
  - Use `flex: 1` on that child so it resizes dynamically.
- For screen containers, use `flex: 1` and `alignSelf: 'stretch'` (or `width: '100%'`) rather than hardcoding screen bounds (e.g., `width: 375`).

---

## 3. Spacing Calculations (Margins, Paddings, Gaps)

Compute spacing based on boundary gaps between nodes:

### Gaps between Siblings
- **Row Gap**: The horizontal gap between Sibling A and Sibling B:
  $$\text{gap} = X_B - (X_A + \text{width}_A)$$
- **Column Gap**: The vertical gap between Sibling A and Sibling B:
  $$\text{gap} = Y_B - (Y_A + \text{height}_A)$$
- **Application**:
  - If multiple consecutive elements share the same gap size, use the `gap` property in StyleSheet (e.g. `gap: 12`).
  - Otherwise, apply specific margins: `marginRight` (for rows) or `marginBottom` (for columns).

### Parent Paddings
- Calculate padding by checking the offset of the first child relative to the parent:
  - `paddingLeft` = $X_{\text{child\_first}}$
  - `paddingTop` = $Y_{\text{child\_first}}$
  - `paddingRight` = $\text{width}_{\text{parent}} - (X_{\text{child\_last}} + \text{width}_{\text{child\_last}})$
  - `paddingBottom` = $\text{height}_{\text{parent}} - (Y_{\text{child\_last}} + \text{height}_{\text{child\_last}})$

---

## 4. Absolute Positioning Detection

Avoid absolute positioning whenever possible to keep layouts responsive. However, use `position: 'absolute'` when:
1. **Overlap**: Two sibling nodes occupy overlapping areas (their bounding boxes intersect in both X and Y dimensions) and one is not fully contained inside the other.
2. **Float Elements**: The element is a floating action button (FAB), status badge bubble on top of an avatar, or a full-bleed decorative background shape.
- **Conversion to StyleSheet**:
  - Set `position: 'absolute'`.
  - Calculate `top`, `bottom`, `left`, `right` relative to the parent container:
    - `left: X_child`
    - `top: Y_child`

---

## 5. Visual Styles & Paint Token Translation

Map Figma node properties to React Native styles:

- **Corner Radius**: Map `cornerRadius` to `borderRadius`.
- **Fills & Colors (`fillStyle`)**:
  - **Check `styles.fillStyle`**: If present (e.g., `"Primary / 1"` or `"Neutral/4"`), map it to the theme variable (e.g., `Colors.light.primary` or `Colors.light.placeholder`).
  - If `fillStyle` is missing, check `styles.fills` array. Use the first color (hex string) for `backgroundColor`.
- **Strokes (Borders)**:
  - Check `styles.strokes` and `styles.strokeWeight`.
  - Map to `borderColor: strokes[0]` and `borderWidth: strokeWeight` (default to `1` if not specified).
- **Opacity**: Map `opacity` directly.

---

## 6. Typography & Text Token Translation

Map `TEXT` node styling parameters to React Native `<Text>` styles:

- **Check `styles.textStyle`**:
  - If present (e.g., `"Body / 3"` or `"Caption / 1"`), use spread syntax to import the typography style from the theme registry.
  - Example: `textStyle: "Body / 3"` $\rightarrow$ `...Typography.body3`.
- **Fallbacks (If `textStyle` is not defined)**:
  - **Color**: Map `styles.fills[0]` (or `fillStyle` if matching color token exists) to `color`.
  - **Font Size**: Map `fontSize` directly.
  - **Font Family & Weight (Custom Poppins Font)**: If `fontFamily === "Poppins"`, map the combination of font name and weight to a specific loaded font family name, **and omit `fontWeight` entirely** (to prevent Android styling fallbacks):
    - `Poppins` + `400` / `Regular` $\rightarrow$ `fontFamily: 'Poppins-Regular'`
    - `Poppins` + `500` / `Medium` $\rightarrow$ `fontFamily: 'Poppins-Medium'`
    - `Poppins` + `600` / `SemiBold` $\rightarrow$ `fontFamily: 'Poppins-SemiBold'`
    - `Poppins` + `700` / `Bold` $\rightarrow$ `fontFamily: 'Poppins-Bold'`
    - `Poppins` + `900` / `Black` $\rightarrow$ `fontFamily: 'Poppins-Black'`
  - **Font Weight (Other Fonts)**: For standard system fonts or XML fonts, map Figma weights directly to React Native weight strings (e.g. `'400'`, `'500'`, `'600'`, `'700'`).
  - **Line Height**:
    - If `lineHeight.unit === "PIXELS"`, map `lineHeight.value` to `lineHeight`.
    - If `lineHeight.unit === "PERCENT"`, convert to pixels: `Math.round(fontSize * (value / 100))`.
    - Do not use percent units directly in React Native `lineHeight`.
- **Text Alignment**:
  - Map `textAlignHorizontal: "LEFT"` to `textAlign: 'left'`.
  - Map `textAlignHorizontal: "CENTER"` to `textAlign: 'center'`.
  - Map `textAlignHorizontal: "RIGHT"` to `textAlign: 'right'`.
