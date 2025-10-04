# 🎨 REGs Global - Branding & Logo Guide
# دليل الهوية البصرية والشعار

## 🌟 Official Logo

![REGs Global Logo](/public/regs-logo.jpg)

### Logo Design Elements
- **Shape:** Islamic 8-pointed star (⭐ نجمة إسلامية)
- **Primary Color:** Gold/Amber (#d4af37)
- **Background:** Navy Blue (#0a2540)
- **Symbol:** Upward trending chart line (📈 نمو)
- **Typography:** Bold serif "REGs"

### Logo Symbolism
- ⭐ **Star Shape:** Islamic architectural heritage
- 📈 **Trending Line:** Growth, prosperity, success
- 🥇 **Gold:** Premium, trust, value
- 🔵 **Navy Blue:** Stability, professionalism, depth
- ⚖️ **Symmetry:** Balance, fairness (Islamic principles)

---

## 🎨 Brand Colors

### Primary Palette

#### Gold (REGs Gold)
```css
--regs-gold-50:  #fefce8;
--regs-gold-100: #fef9c3;
--regs-gold-200: #fef08a;
--regs-gold-300: #fde047;
--regs-gold-400: #facc15;
--regs-gold-500: #d4af37;  /* Primary Gold */
--regs-gold-600: #ca8a04;
--regs-gold-700: #a16207;
--regs-gold-800: #854d0e;
--regs-gold-900: #713f12;
```

**Usage:**
- Logo accents
- Primary buttons
- Premium badges
- Hover states
- Success indicators

#### Navy Blue (REGs Navy)
```css
--regs-navy-50:  #f0f9ff;
--regs-navy-100: #e0f2fe;
--regs-navy-200: #bae6fd;
--regs-navy-300: #7dd3fc;
--regs-navy-400: #38bdf8;
--regs-navy-500: #0ea5e9;
--regs-navy-600: #0284c7;
--regs-navy-700: #0369a1;
--regs-navy-800: #0a2540;  /* Primary Navy */
--regs-navy-900: #082031;
```

**Usage:**
- Logo background
- Headers
- Cards backgrounds
- Text emphasis
- Shadows

### Secondary Colors

#### Emerald (Halal Green)
```css
--emerald-500: #10b981;
--emerald-600: #059669;  /* Halal badges */
--emerald-700: #047857;
```

**Usage:**
- Halal certification badges
- Success states
- Positive indicators
- Growth metrics

#### Silver (Accent)
```css
--slate-500: #64748b;
--slate-800: #1e293b;
```

**Usage:**
- Secondary elements
- Borders
- Muted text

---

## 📐 Logo Usage Guidelines

### Sizes

#### Small (Mobile/Icons)
```tsx
<img 
  src="/regs-logo.jpg" 
  alt="REGs Global" 
  className="w-8 h-8"
/>
```

#### Medium (Navigation)
```tsx
<img 
  src="/regs-logo.jpg" 
  alt="REGs Global" 
  className="w-10 h-10"
/>
```

#### Large (Hero/Landing)
```tsx
<img 
  src="/regs-logo.jpg" 
  alt="REGs Global" 
  className="w-14 h-14"
/>
```

### With Text

```tsx
<Link to="/" className="flex items-center gap-3 group">
  <div className="relative">
    <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
    <img 
      src="/regs-logo.jpg" 
      alt="REGs Global Logo" 
      className="relative w-12 h-12 object-contain group-hover:scale-110 transition-transform"
    />
  </div>
  <div>
    <div className="font-black text-xl bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent">
      REGs GLOBAL
    </div>
    <div className="text-[10px] text-muted-foreground font-medium">
      Powered by Sidra Chain
    </div>
  </div>
</Link>
```

### Clear Space
Maintain minimum clear space around logo equal to 25% of logo height.

```
┌─────────────────────┐
│     (clear space)   │
│  ┌───────────────┐  │
│  │               │  │
│  │   REGs Logo   │  │
│  │               │  │
│  └───────────────┘  │
│     (clear space)   │
└─────────────────────┘
```

---

## 🎯 Logo Component

### React Component
Created: `src/components/layout/Logo.tsx`

```tsx
import Logo from '@/components/layout/Logo';

// Small logo only
<Logo size="sm" showText={false} />

// Medium logo with text (default)
<Logo size="md" showText={true} />

// Large logo with text
<Logo size="lg" showText={true} />

// Custom className
<Logo size="md" className="my-custom-class" />
```

### Props
```typescript
interface LogoProps {
  size?: 'sm' | 'md' | 'lg';  // default: 'md'
  showText?: boolean;          // default: true
  className?: string;          // optional
}
```

---

## 🌈 Gradient Combinations

### Primary Gold Gradient
```css
bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700
```
**Use for:** Logo text, premium features, main CTAs

### Navy to Gold
```css
bg-gradient-to-br from-slate-800 to-amber-600
```
**Use for:** Hero backgrounds, feature cards

### Gold Glow Effect
```css
/* Blur background */
bg-gradient-to-r from-amber-500 to-yellow-600 blur-lg opacity-50

/* On hover */
group-hover:opacity-75 transition-opacity
```

---

## 💎 Brand Applications

### 1. Navigation Bar
```tsx
<nav className="bg-slate-900 border-b border-amber-500/20">
  <Logo size="md" showText={true} />
</nav>
```

### 2. Hero Section
```tsx
<div className="bg-gradient-to-b from-slate-900 via-slate-800 to-amber-900/20">
  <Logo size="lg" showText={true} />
</div>
```

### 3. Cards
```tsx
<Card className="border-2 border-amber-500/30 bg-slate-900/50">
  <Logo size="sm" showText={false} />
</Card>
```

### 4. Buttons
```tsx
/* Primary Button */
<Button className="bg-gradient-to-r from-amber-600 to-yellow-600 
                   hover:from-amber-700 hover:to-yellow-700">
  Trade Now
</Button>

/* Outline Button */
<Button variant="outline" className="border-2 border-amber-500 
                                    text-amber-600 
                                    hover:bg-amber-500 hover:text-white">
  Learn More
</Button>
```

### 5. Badges
```tsx
/* Gold Badge */
<Badge className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white">
  Premium
</Badge>

/* Navy Badge */
<Badge className="bg-slate-900 text-amber-500 border border-amber-500/30">
  RWA
</Badge>

/* Halal Badge (Keep emerald) */
<Badge className="bg-emerald-600 text-white">
  <Shield className="h-3 w-3 mr-1" />
  HALAL
</Badge>
```

---

## 📱 Responsive Logo

### Mobile
```tsx
<img 
  src="/regs-logo.jpg" 
  alt="REGs Global" 
  className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
/>
```

### Hide text on mobile
```tsx
<div className="hidden sm:block">
  <span>REGs GLOBAL</span>
</div>
```

---

## 🎨 Typography with Brand Colors

### Headings
```tsx
/* Gold Gradient Text */
<h1 className="text-5xl font-black bg-gradient-to-r 
               from-amber-600 via-yellow-600 to-amber-700 
               bg-clip-text text-transparent">
  Trade Halal Assets
</h1>

/* Navy Solid */
<h2 className="text-3xl font-bold text-slate-900 dark:text-white">
  Premium Features
</h2>
```

### Body Text
```tsx
/* Primary */
<p className="text-slate-700 dark:text-slate-300">
  Regular content text
</p>

/* Muted */
<p className="text-slate-500 dark:text-slate-400">
  Secondary information
</p>

/* Accent */
<span className="text-amber-600 font-semibold">
  Premium feature
</span>
```

---

## 🌟 Icon Colors

### Primary Icons
```tsx
<TrendingUp className="h-6 w-6 text-amber-600" />
<Star className="h-6 w-6 text-yellow-500" />
<Award className="h-6 w-6 text-amber-500" />
```

### Halal Icons (Keep Green)
```tsx
<Shield className="h-6 w-6 text-emerald-600" />
<CheckCircle2 className="h-6 w-6 text-emerald-600" />
```

### Neutral Icons
```tsx
<Settings className="h-6 w-6 text-slate-600" />
<User className="h-6 w-6 text-slate-700" />
```

---

## 🚫 Logo Don'ts

### ❌ Don't:
1. **Stretch or distort** the logo
2. **Change colors** (except for dark/light mode)
3. **Add effects** (drop shadows, outlines)
4. **Place on busy backgrounds**
5. **Rotate or tilt**
6. **Use low-resolution versions**
7. **Recreate or redraw**
8. **Add text inside the star**

### ✅ Do:
1. **Maintain aspect ratio**
2. **Use on solid backgrounds**
3. **Ensure adequate contrast**
4. **Use provided assets**
5. **Follow size guidelines**
6. **Test on all screen sizes**
7. **Respect clear space**

---

## 📦 Logo Files

### Location
```
public/
  └── regs-logo.jpg  (Official logo)
```

### Formats Needed (Future)
- `regs-logo.svg` - Vector (scalable)
- `regs-logo-512.png` - High res
- `regs-logo-192.png` - Medium
- `regs-logo-64.png` - Favicon
- `regs-logo-white.png` - White version
- `regs-logo-dark.png` - Dark mode

---

## 🎯 Brand Personality

### Visual Style
- **Luxurious** - Gold accents, premium feel
- **Trustworthy** - Navy blue, solid foundations
- **Islamic** - Star pattern, geometric shapes
- **Modern** - Clean lines, gradients
- **Professional** - Balanced, sophisticated

### Tone of Voice
- **Confident** but humble
- **Professional** but approachable
- **Innovative** but respectful of tradition
- **Global** but rooted in Islamic values

---

## 📊 Usage Examples

### Home Page
```tsx
// Hero with gold gradient
<div className="bg-gradient-to-b from-slate-900 to-slate-800">
  <Logo size="lg" />
  <h1 className="bg-gradient-to-r from-amber-600 to-yellow-600 
                 bg-clip-text text-transparent">
    REGs Global
  </h1>
</div>
```

### Markets Page
```tsx
// Navy card with gold accents
<Card className="bg-slate-900 border-amber-500/30">
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 bg-slate-800 border-2 border-amber-500/30 
                    rounded-full flex items-center justify-center">
      <span className="text-amber-500 font-bold">BTC</span>
    </div>
  </div>
</Card>
```

### Login Page
```tsx
<div className="min-h-screen bg-slate-900">
  <Card className="bg-slate-800 border-amber-500/20">
    <Logo size="md" className="mx-auto mb-6" />
    <Button className="bg-gradient-to-r from-amber-600 to-yellow-600">
      Sign In
    </Button>
  </Card>
</div>
```

---

## 🔄 Dark Mode

### Auto-adjust
```tsx
/* Logo stays same (has built-in dark background) */
<img src="/regs-logo.jpg" alt="REGs Global" />

/* Text adjusts */
<span className="text-slate-900 dark:text-white">
  REGs Global
</span>

/* Backgrounds adjust */
<div className="bg-white dark:bg-slate-900">
  {/* Content */}
</div>
```

---

## ✨ Animation Effects

### Logo Hover
```tsx
<img 
  src="/regs-logo.jpg"
  className="group-hover:scale-110 transition-transform duration-300"
/>
```

### Glow Effect
```tsx
<div className="relative">
  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-600 
                  blur-lg opacity-0 group-hover:opacity-75 transition-opacity"></div>
  <img src="/regs-logo.jpg" className="relative" />
</div>
```

---

## 📝 Checklist

Before launch, ensure:
- [ ] Logo displays correctly on all pages
- [ ] Favicon updated (browser tab)
- [ ] Apple touch icon set
- [ ] Open Graph image set
- [ ] Twitter card image set
- [ ] All gradients use brand colors
- [ ] Dark mode tested
- [ ] Mobile responsive
- [ ] Print styles (if needed)
- [ ] Loading states show logo
- [ ] Error pages have logo

---

**Brand Identity Complete! ✅**

REGs Global now has a cohesive, premium, Islamic-inspired brand identity that reflects its position as the world's first Sharia-compliant RWA exchange.

**Built with ❤️ for the Muslim Ummah**

---

© 2025 REGs Global. All rights reserved.
Powered by Sidra Chain | GLNs Global

