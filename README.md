# Aequitally 🧮

**A modern expense sharing and settlement application built with Next.js 15, React 19, and Convex.**

Aequitally helps you track shared expenses and settle up with friends, family, or colleagues in a fair and transparent way. Create tallies, add participants, split expenses, and see who owes what—all in real-time.

[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Convex](https://img.shields.io/badge/Convex-1.26.2-FF6B35?style=flat-square)](https://convex.dev/)

## ✨ Features

- **💰 Expense Tracking**: Add, edit, and categorize shared expenses
- **👥 Participant Management**: Easily manage group members and their contributions
- **⚡ Real-time Sync**: Live updates across all devices using Convex
- **📊 Smart Settlements**: Automatic calculation of who owes whom
- **📱 Responsive Design**: Works seamlessly on desktop and mobile
- **🌙 Theme Support**: Light and dark mode with system preference detection
- **📈 CSV Export**: Export settlement data for record keeping
- **🔒 Type Safety**: Built with TypeScript for robust development
- **🎨 Modern UI**: Beautiful interface using shadcn/ui components

## 🛠️ Technology Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) with App Router and Turbopack
- **UI Library**: [React 19](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with CSS Variables
- **Components**: [shadcn/ui](https://ui.shadcn.com/) with accessible primitives
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Valibot](https://valibot.dev/) validation
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Motion](https://motion.dev/) for smooth interactions

### Backend
- **Backend-as-a-Service**: [Convex](https://convex.dev/) for real-time data and serverless functions
- **Database**: Convex's built-in real-time database
- **Schema Validation**: [Valibot](https://valibot.dev/) for runtime type checking and form validation

### Development Tools
- **Package Manager**: [pnpm](https://pnpm.io/) for fast, efficient dependency management
- **Code Quality**: [Biome](https://biomejs.dev/) for linting and formatting
- **Git Hooks**: [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged)
- **Build Tool**: Turbopack for lightning-fast builds

## 🚀 Quick Start

### Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **pnpm**: Latest version (recommended package manager)
- **Convex Account**: Sign up at [convex.dev](https://convex.dev/)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aequitally
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up Convex**
   ```bash
   # Install Convex CLI globally (if not already installed)
   pnpm add -g convex
   
   # Initialize Convex project
   npx convex dev
   ```

4. **Configure environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   
   # Add your Convex deployment URL
   # NEXT_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.cloud
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with Turbopack |
| `pnpm build` | Build the application for production |
| `pnpm start` | Start the production server |
| `pnpm lint:fix` | Run Biome linter with automatic fixes |
| `pnpm format` | Format code using Biome |
| `pnpm format:fix` | Format and fix code issues |
| `npx convex dev` | Start Convex development backend |
| `npx convex deploy` | Deploy Convex functions to production |

## 🏗️ Project Structure

```
aequitally/
├── app/                    # Next.js App Router pages and layouts
│   ├── tally/[id]/        # Dynamic tally pages
│   ├── about/             # About page
│   ├── privacy/           # Privacy policy
│   ├── terms/             # Terms of service
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page (create tally)
│   └── globals.css        # Global styles and CSS variables
├── components/            # React components
│   ├── ui/               # shadcn/ui base components
│   ├── common/           # Shared components (header, footer, etc.)
│   ├── home/             # Home page specific components
│   ├── tally/            # Tally feature components
│   └── layouts/          # Layout components
├── convex/               # Convex backend
│   ├── _generated/       # Auto-generated Convex files
│   ├── schema.ts         # Database schema definitions
│   ├── tally.ts          # Tally-related serverless functions
│   └── tsconfig.json     # TypeScript config for Convex
├── hooks/                # Custom React hooks
│   ├── use-currency.tsx  # Currency management hook
│   ├── use-expense-form.tsx # Expense form state management
│   └── use-toast.tsx     # Toast notification hook
├── lib/                  # Utilities, helpers, and configurations
│   ├── config/           # Configuration files
│   ├── data/             # Static data and constants
│   ├── handlers/         # Business logic handlers
│   ├── helpers/          # Utility functions
│   ├── schemas/          # Validation schemas
│   ├── services/         # External service integrations
│   ├── types/            # TypeScript type definitions
│   └── utils/            # General utility functions
├── providers/            # React context providers
│   ├── convex-client-provider.tsx # Convex client setup
│   ├── currency-provider.tsx     # Global currency state
│   ├── theme-provider.tsx        # Theme management
│   └── provider-wrapper.tsx      # Combined providers
└── public/               # Static assets
    ├── manifest.json     # PWA manifest
    └── robots.txt        # Search engine robots file
```

## 🎨 UI Components & Customization

### shadcn/ui Integration

This project uses [shadcn/ui](https://ui.shadcn.com/) components with accessible primitives. These components are:

- **Fully customizable** through CSS variables
- **Accessible** by default with ARIA attributes
- **Type-safe** with TypeScript
- **Themeable** with light/dark mode support

#### Component Configuration

The project is configured with shadcn/ui using the "New York" style:

```json
{
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "baseColor": "neutral",
    "cssVariables": true
  },
  "iconLibrary": "lucide"
}
```

### Theme Customization with tweakcn

For easy theme customization, we recommend using [tweakcn](https://tweakcn.com/) - a visual theme editor for shadcn/ui:

1. **Visit [tweakcn.com](https://tweakcn.com/)**
2. **Import your current theme** or start with a preset
3. **Customize colors, spacing, and typography** visually
4. **Export CSS variables** and update your `globals.css`

#### Theme Variables

Customize the application theme by modifying CSS variables in `app/globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* ... more variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  /* ... more variables */
}
```

### Adding New shadcn/ui Components

To add new shadcn/ui components to your project:

```bash
# Add a specific component
npx shadcn@latest add button

# Add multiple components
npx shadcn@latest add button card dialog

# List available components
npx shadcn@latest add
```

## 🌐 Core Features

### Tally Management
- Create new expense tallies with customizable names and descriptions
- Set tally dates and manage participant lists
- Real-time synchronization across all connected devices

### Expense Tracking
- Add expenses with detailed descriptions and amounts
- Support for different split methods (equal, by percentage, custom amounts)
- Date tracking for each expense
- Search and sort expenses by various criteria

### Settlement Calculation
- Automatic calculation of who owes whom
- Optimized settlement suggestions to minimize transactions
- Export settlement data to CSV for record keeping
- Visual representation of balances and transfers

### Multi-Currency Support
- Support for 150+ global currencies
- Real-time currency formatting
- Consistent currency display throughout the application

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Push your code to GitHub**

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Vercel will automatically detect Next.js and configure build settings
   - Add your environment variables in the Vercel dashboard

3. **Deploy Convex backend**
   ```bash
   npx convex deploy
   ```

4. **Update environment variables**
   - Update `NEXT_PUBLIC_CONVEX_URL` with your production Convex URL

### Environment Variables

Required environment variables for deployment:

```bash
# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Optional: Analytics, monitoring, etc.
# Add additional environment variables as needed
```

### Build Optimization

The project is optimized for production with:
- **Turbopack** for fast builds
- **Automatic tree shaking** for smaller bundle sizes
- **Image optimization** with Next.js Image component
- **CSS optimization** with Tailwind CSS purging

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Run quality checks**
   ```bash
   pnpm format:fix
   pnpm lint:fix
   ```
5. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```
6. **Push and create a Pull Request**

### Code Style

- **Formatting**: Automated with Biome
- **Linting**: Enforced with Biome
- **TypeScript**: Strict mode enabled
- **Commits**: Use conventional commit messages

### Pre-commit Hooks

The project uses Husky and lint-staged to run quality checks on commit:

- Code formatting with Biome
- Linting with Biome
- TypeScript type checking

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[shadcn](https://twitter.com/shadcn)** for the amazing UI component library
- **[Convex](https://convex.dev/)** for the powerful backend-as-a-service platform
- **[Vercel](https://vercel.com/)** for Next.js and deployment platform
- **[Valibot](https://valibot.dev/)** for schema validation and type safety

---

**Built with ❤️ using modern web technologies**
