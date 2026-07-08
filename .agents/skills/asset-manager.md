# Skill: Asset Export and Manager

This skill details how to scan Figma node trees, detect missing icons and images, export them directly from Figma to the project using Figma MCP tools, and manage the asset registry.

---

## 1. Detecting Assets in Figma JSON

Analyze the JSON nodes in the design export `layout.json` (inside the screen or common component subdirectories):
- **Icons**:
  - Elements with names containing `icon/`, `icons/`, `logo`, `arrow`, `chevron`, `star`, or type `VECTOR` / `BOOLEAN_OPERATION` with vector coordinates.
  - Instances representing UI icons (e.g., `name: "icon/navigation/unfold_more_24px"`).
- **Images**:
  - Node names containing `image`, `photo`, `avatar`, `illustration`.
  - Nodes of type `RECTANGLE` or `FRAME` that contain image fills (e.g., fill type is `IMAGE`).

---

## 2. Exporting Assets via Figma MCP

If a detected asset is not already present in the local `assets/icons/` or `assets/images/` directories, export it using the `figma-mcp-go` server's `save_screenshots` tool.

### Call Parameters for `save_screenshots`
- **For Icons (Vector)**:
  - Format: `"SVG"`
  - Scale: Default (1)
  - Output Path: `assets/icons/<icon_name>.svg`
- **For Images (Raster)**:
  - Format: `"PNG"`
  - Scale: `2` or `3` (for high-DPI displays)
  - Output Path: `assets/images/<image_name>.png`

### Example MCP Argument Payload:
```json
{
  "items": [
    {
      "nodeId": "I213:23271;594:7;594:4",
      "outputPath": "/home/gmo/Documents/Learning/LearnJS/react-native-figma-test/assets/icons/unfold_more_24px.svg",
      "format": "SVG"
    },
    {
      "nodeId": "389:5129",
      "outputPath": "/home/gmo/Documents/Learning/LearnJS/react-native-figma-test/assets/icons/down-arrow.svg",
      "format": "SVG"
    }
  ]
}
```

---

## 3. Creating & Updating Asset Registries

Maintain centralized indices for easy importing:

### Icon Registry (`assets/icons/index.ts`)
Map kebab-case SVG file names to a TypeScript export registry:
```typescript
export const Icons = {
  unfoldMore: require('./unfold_more_24px.svg'),
  downArrow: require('./down-arrow.svg'),
} as const;

export type IconType = keyof typeof Icons;
```

### Image Registry (`assets/images/index.ts`)
```typescript
export const Images = {
  avatarPlaceholder: require('./avatar-placeholder.png'),
  loginBackground: require('./login-bg.png'),
} as const;

export type ImageType = keyof typeof Images;
```

---

## 4. Rendering Assets in Generated Code

Use `expo-image`'s `<Image>` component for rendering both SVGs and PNGs. It is optimized, performs caching, and handles SVG rendering on native platforms without requiring Metro configuration modifications.

### Code Pattern:
```typescript
import { Image } from 'expo-image';
import { Icons } from '@/assets/icons';

export function ExpandIcon() {
  return (
    <Image 
      source={Icons.unfoldMore} 
      style={{ width: 24, height: 24 }}
      contentFit="contain"
    />
  );
}
```
For dynamic icon rendering:
```typescript
import { Image } from 'expo-image';
import { Icons, IconType } from '@/assets/icons';

interface CustomIconProps {
  name: IconType;
  size?: number;
}

export function CustomIcon({ name, size = 24 }: CustomIconProps) {
  return (
    <Image 
      source={Icons[name]} 
      style={{ width: size, height: size }}
      contentFit="contain"
    />
  );
}
```
**Avoid** writing inline SVG paths (like `<Svg><Path ... /></Svg>`) in React Native components, as it creates duplicate SVG definitions and bloats components. Rely on clean exports to `.svg` files inside `assets/icons/`.
