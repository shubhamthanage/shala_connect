# ShalaConnect Design System

Industry-grade theme for consistent, accessible, and polished UI across the platform.

## Design Tokens

### Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `saffron` | #F46A0A | Primary CTA, accents |
| `saffron-bright` | #FF7B1C | Hover states, highlights |
| `saffron-pale` | #FFF3E8 | Backgrounds, selected states |
| `gold` | #F59E0B | Gradients, secondary accent |
| `green-mid` | #16A34A | Success, positive metrics |
| `green-bright` | #22C55E | Live badges, success |
| `navy` | #050F1E | Dark backgrounds |
| `navy-2` | #091627 | Sidebar, dark panels |
| `cream` | #FDFAF5 | Page background |
| `cream-2` | #F8F4EE | Alternate sections |
| `text-900` | #060E1C | Primary text |
| `text-700` | #243347 | Secondary text |
| `text-500` | #4A6380 | Muted text |
| `text-300` | #8AAABF | Placeholder, captions |
| `border-school` | #E5EEF6 | Borders |
| `border-2` | #D0E2F0 | Stronger borders |

### Typography
- **Headings**: `font-heading` (Baloo 2)
- **Body**: `font-body` (Noto Sans Devanagari)
- **Labels/Caps**: `font-sora` (Plus Jakarta Sans)

### Spacing (8pt grid)
`space-1` (4px) through `space-24` (96px)

### Shadows
- `sh-xs` → `sh-xl` — elevation scale
- `saffron-glow` — primary button
- `saffron-hover` — primary hover

### Radius
`r4` (4px) through `r32` (32px), `pill` (999px)

## Component Classes

Use these in `className` for consistency:

| Class | Usage |
|-------|-------|
| `btn-primary` | Primary CTA buttons |
| `btn-secondary` | Secondary/outline buttons |
| `btn-ghost-dark` | Buttons on dark backgrounds |
| `card-elevated` | White cards with shadow |
| `card-accent` | Cards with subtle hover |
| `card-accent-lg` | Cards with prominent hover |
| `section-label` | Section eyebrow labels |
| `nav-link` | Navigation links (dark context) |
| `input-base` | Form inputs |

## Button Component

```tsx
import { Button } from "@/components/ui/button"

<Button variant="default">Primary</Button>
<Button variant="outline">Secondary</Button>
<Button variant="ghost-dark">Dark context</Button>
<Button size="lg">Large</Button>
```

## Accessibility

- **Focus visible**: All interactive elements have `focus-visible:ring-2` for keyboard nav
- **Contrast**: Text meets WCAG AA on backgrounds
- **Touch targets**: Min 44px for mobile

## Transitions

- `duration-fast`: 150ms
- `duration-normal`: 250ms  
- `duration-slow`: 350ms
- `ease-out-expo`: cubic-bezier(0.16, 1, 0.3, 1)
