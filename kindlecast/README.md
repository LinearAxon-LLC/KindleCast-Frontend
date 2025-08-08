# KindleCast - Apple Design Blueprint Implementation

A Next.js application built following Apple's Human Interface Guidelines with Tailwind CSS, shadcn/ui, and Framer Motion for smooth, premium interactions.

## 🎯 Project Overview

KindleCast is designed to transform digital books into high-quality audiobooks using advanced AI voice technology. This frontend implementation follows Apple's design principles to create an authentic macOS/iOS experience with premium feel and smooth interactions.

## ✨ Features

- **Apple-Inspired Design System**: Following Apple's Human Interface Guidelines
- **Dark/Light Mode**: Seamless theme switching with system preference detection
- **Smooth Animations**: Framer Motion powered interactions with Apple-style easing
- **Responsive Design**: Mobile-first approach with Apple's breakpoint system
- **Premium Typography**: SF Pro Display/Text inspired font system
- **Component Library**: Reusable UI components with consistent styling
- **Performance Optimized**: Next.js 15 with Turbopack for fast development

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4 with custom Apple design tokens
- **UI Components**: shadcn/ui with Apple-inspired customizations
- **Animations**: Framer Motion with Apple-style presets
- **Icons**: Lucide React
- **Theme**: next-themes for dark/light mode
- **TypeScript**: Full type safety

## 🎨 Design System

### Color Palette
- **Brand Colors**: Purple gradient palette (#8F87F1 → #C68EFD → #E9A5F1 → #FED2E2)
- **Apple System Colors**: Blue (#007AFF), Red (#FF3B30), Green (#34C759), etc.
- **Semantic Grays**: Light mode (#FAFAFA → #171717) and Dark mode (#1C1C1E → #F2F2F7)

### Typography
- **Font System**: Inter (fallback to Apple system fonts)
- **Scale**: Apple's type scale (11px → 48px) with proper line heights and letter spacing
- **Variants**: Display, Title1-3, Body, Caption, Footnote, Link

### Components
- **Buttons**: Apple-style with hover/active states and focus rings
- **Cards**: Rounded corners (20px), subtle shadows, backdrop blur
- **Animations**: Fade, slide, scale, and stagger animations with Apple easing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kindlecast
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
kindlecast/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── globals.css      # Global styles with Apple design tokens
│   │   ├── layout.tsx       # Root layout with theme provider
│   │   └── page.tsx         # Landing page
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   │   ├── button.tsx   # Apple-styled button component
│   │   │   ├── card.tsx     # Card component with backdrop blur
│   │   │   ├── input.tsx    # Form input component
│   │   │   ├── text.tsx     # Typography component
│   │   │   ├── animated.tsx # Framer Motion wrapper components
│   │   │   └── theme-toggle.tsx # Dark/light mode toggle
│   │   └── theme-provider.tsx # Theme context provider
│   └── lib/
│       ├── utils.ts         # Utility functions (cn, etc.)
│       ├── typography.ts    # Typography system
│       ├── layout.ts        # Layout utilities
│       └── animations.ts    # Framer Motion presets
├── public/                  # Static assets
├── components.json          # shadcn/ui configuration
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies and scripts
├── tailwind.config.ts      # Tailwind configuration
└── tsconfig.json           # TypeScript configuration
```

## 🎭 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Design Tokens

The project uses a comprehensive design token system defined in `globals.css`:

### Colors
```css
/* KindleCast Brand Colors */
--color-brand-primary: #8F87F1;
--color-brand-secondary: #C68EFD;
--color-brand-tertiary: #E9A5F1;
--color-brand-accent: #FED2E2;

/* Apple System Colors */
--color-apple-blue: #007AFF;
--color-apple-red: #FF3B30;
/* ... more colors */
```

### Typography
```css
/* Apple Typography Scale */
--font-size-xs: 11px;
--font-size-sm: 12px;
--font-size-base: 13px;
--font-size-lg: 16px;
/* ... more sizes */
```

## 🎬 Animation System

Pre-configured Framer Motion animations following Apple's motion principles:

```typescript
// Usage examples
<FadeInSection delay={0.2}>
  <h1>Animated heading</h1>
</FadeInSection>

<SlideIn direction="up">
  <Card>Animated card</Card>
</SlideIn>

<Pressable>
  <Button>Interactive button</Button>
</Pressable>
```

## 🌙 Theme System

Built-in dark/light mode support with system preference detection:

```typescript
import { ThemeToggle } from '@/components/ui/theme-toggle'

// Automatic theme toggle button
<ThemeToggle />
```

## 📱 Responsive Design

Mobile-first approach with Apple's breakpoint system:
- `sm`: 640px (Mobile landscape)
- `md`: 768px (Tablet portrait)
- `lg`: 1024px (Tablet landscape)
- `xl`: 1280px (Desktop)
- `2xl`: 1536px (Large desktop)

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Deploy automatically

### Other Platforms
```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the Apple design guidelines
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Apple Human Interface Guidelines
- shadcn/ui component library
- Tailwind CSS team
- Framer Motion team
- Next.js team
