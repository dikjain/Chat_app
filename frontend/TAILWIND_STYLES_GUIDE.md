# Tailwind Styles Guide

This document explains the Tailwind CSS setup and custom styles used throughout the Chat App.

## 📁 File Structure

- **`src/index.css`** - Main global styles file (imported in `main.jsx`)
- **`src/styles/globals.css`** - Alternative location for global styles (for Next.js migration)
- **`tailwind.config.js`** - Tailwind configuration with custom theme extensions

## 🎨 Custom Design Tokens

### Colors

The app uses a comprehensive color system with CSS custom properties:

#### Standard Colors (via CSS Variables)
- `--background` / `--foreground` - Base colors
- `--primary` / `--primary-foreground` - Primary brand color
- `--secondary` / `--secondary-foreground` - Secondary color
- `--muted` / `--muted-foreground` - Muted/subtle colors
- `--accent` / `--accent-foreground` - Accent colors
- `--destructive` / `--destructive-foreground` - Error/destructive actions
- `--border` / `--input` / `--ring` - Border and input colors
- `--card` / `--popover` - Component background colors

#### App-Specific Colors (in Tailwind Config)
```javascript
app: {
  primary: '#10b981',        // Main green
  'primary-dark': '#48bb78',  // Darker green
  'primary-light': '#22c55e', // Lighter green
  orange: '#e69500',
  purple: '#a32bff',
  cyan: '#0099b0',
  'bg-dark': '#020202',
  'bg-darker': '#18191a',
  'bg-light': '#E8E8E8',
  'text-off-white': '#f0f0f0',
  error: '#EF4444',
}
```

**Usage:**
```jsx
<div className="bg-app-primary text-app-text-off-white">
<div className="bg-app-bg-dark">
<div className="text-app-error">
```

### Typography

#### Font Families
- **`font-sans`** - Inter (default)
- **`font-inter`** - Inter (explicit)
- **`font-saira`** - Saira (for headings and buttons)
- **`font-vend`** - Vend Sans (for special text)
- **`font-mono`** - Monospace
- **`font-serif`** - Serif

**Usage:**
```jsx
<h1 className="font-saira font-semibold">Heading</h1>
<p className="font-inter">Body text</p>
<span className="font-vend italic">Special text</span>
```

### Border Radius

Custom radius values based on CSS variable:
- `rounded-sm` - `calc(var(--radius) - 4px)`
- `rounded-md` - `calc(var(--radius) - 2px)`
- `rounded-lg` - `var(--radius)` (0.5rem)
- `rounded-xl` - `calc(var(--radius) + 4px)`

### Box Shadows

Predefined shadow utilities:
- `shadow-in` - `inset 0 1px 2px 0 rgba(0, 0, 0, 0.3)`
- `shadow-out` - `0 1px 2px 0 rgba(0, 0, 0, 0.3)`

**Usage:**
```jsx
<div className="shadow-in">Inset shadow</div>
<div className="shadow-out">Outer shadow</div>
```

## 🎭 Custom Utility Classes

### Animation Classes

#### `.animate-slide-in`
Slide-in animation from bottom:
```jsx
<div className="animate-slide-in">Content</div>
```

#### `.animate-shimmer`
Shimmer loading effect:
```jsx
<div className="animate-shimmer">Loading...</div>
```

### Shadow Utilities

#### `.shadow-inset`
Inset shadow for pressed/embedded elements:
```jsx
<button className="shadow-inset">Button</button>
```

#### `.shadow-out`
Standard outer shadow:
```jsx
<div className="shadow-out">Card</div>
```

#### `.shadow-card`
Card shadow (slightly larger):
```jsx
<div className="shadow-card">Card content</div>
```

#### `.shadow-button`
Button shadow:
```jsx
<button className="shadow-button">Click me</button>
```

### Text Utilities

#### `.text-gradient-green`
Green gradient text:
```jsx
<h1 className="text-gradient-green">Gradient Text</h1>
```

#### `.text-xxs` / `.text-xxxs`
Extra small text sizes:
```jsx
<span className="text-xxs">10px text</span>
<span className="text-xxxs">8px text</span>
```

### Mask Utilities

#### `.mask-fade-bottom`
Fade mask from bottom (for hero images):
```jsx
<div className="mask-fade-bottom">Content</div>
```

#### `.mask-fade-top`
Fade mask from top:
```jsx
<div className="mask-fade-top">Content</div>
```

### Layout Utilities

#### `.size-full`
Set both width and height to 100%:
```jsx
<div className="size-full">Full size container</div>
```

#### `.scrollbar-none`
Hide scrollbars:
```jsx
<div className="scrollbar-none overflow-y-auto">Scrollable content</div>
```

### Effect Utilities

#### `.glass`
Glass morphism effect:
```jsx
<div className="glass">Glass effect</div>
```

#### `.bg-gradient-green-radial`
Radial green gradient background:
```jsx
<div className="bg-gradient-green-radial">Gradient background</div>
```

## 📱 Responsive Utilities

### Mobile Utilities

#### `.mobile-hidden`
Hide on mobile (hidden below 640px):
```jsx
<div className="mobile-hidden">Desktop only</div>
```

#### `.mobile-only`
Show only on mobile (hidden above 640px):
```jsx
<div className="mobile-only">Mobile only</div>
```

## 🎨 Common Patterns

### Button Styles

**Primary Button:**
```jsx
<button className="px-3 py-1 font-saira font-medium text-white rounded-md bg-gradient-to-t from-green-600 to-green-400 shadow-[-2px_2px_6px_0px_#4ade8070,-8px_8px_16px_0px_#4ade8070,-16px_16px_32px_0px_#4ade8070,inset_0px_1px_4px_1px_#ffffff90] drop-shadow-[0px_1px_0px_#00000040]">
  Click me
</button>
```

**Card with Shadow:**
```jsx
<div className="bg-white rounded-lg border border-neutral-200 shadow-card p-4">
  Card content
</div>
```

**Input Field:**
```jsx
<input className="w-full px-3 py-2 font-inter text-sm bg-neutral-100 rounded-lg border border-neutral-200/70 focus:outline-none focus:ring-0" />
```

## 🌙 Dark Mode

Dark mode is supported via the `.dark` class on the root element. All color variables automatically switch:

```jsx
// Light mode (default)
<div className="bg-background text-foreground">

// Dark mode (when .dark class is on html/body)
<div className="bg-background text-foreground">
```

## 🗺️ Third-Party Styles

### Leaflet Maps

Leaflet map styles are automatically imported and customized:
- Attribution is smaller and less intrusive
- Container padding is removed

## 📝 Best Practices

1. **Use CSS Variables** - Prefer `bg-background` over hardcoded colors
2. **Use Custom Utilities** - Use `.shadow-card` instead of inline shadow styles
3. **Font Consistency** - Use `font-saira` for headings, `font-inter` for body
4. **Responsive Design** - Use Tailwind's responsive prefixes (`md:`, `lg:`, `xl:`)
5. **Dark Mode** - Always test components in both light and dark modes

## 🔧 Extending Styles

### Adding New Colors

Edit `tailwind.config.js`:
```javascript
colors: {
  app: {
    'new-color': '#ff0000',
  }
}
```

### Adding New Utilities

Add to `@layer utilities` in `index.css`:
```css
@layer utilities {
  .my-custom-utility {
    /* styles */
  }
}
```

### Adding New Components

Add to `@layer components` in `index.css`:
```css
@layer components {
  .my-component {
    @apply base-classes;
  }
}
```

## 📚 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS Custom Properties](https://tailwindcss.com/docs/customizing-colors#using-css-variables)
- [CSS Custom Properties Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

