<div align="center">
  
  <img src="./public/logo.png" alt="SwipeTank Logo" width="120" height="120" style="border-radius: 20px; margin-bottom: 20px;" />
  
  # 🚀 SwipeTank - Transform Ideas Into Startups

[![Next.js](https://img.shields.io/badge/Next.js-14.2.16-black?style=flat-square&logo=next.js)](https://nextjs.org/) [![React](https://img.shields.io/badge/React-18.x-blue?style=flat-square&logo=react)](https://reactjs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38b2ac?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/) [![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

> **SwipeTank** is an innovative platform that bridges the gap between visionary entrepreneurs and strategic investors through AI-powered analytics, competitor insights, and intelligent matching systems.

## 🎯 Overview

SwipeTank revolutionizes the startup ecosystem by providing a comprehensive platform where entrepreneurs can analyze market opportunities, build investor-ready portfolios, and connect with the right investors. Think "Tinder for startups and investors" but with powerful analytics and insights.

### ✨ Key Features

- **🔍 AI-Powered App Analytics** - Deep dive into app performance metrics and market positioning
- **📊 Competitor Analysis** - Identify market gaps and opportunities through comprehensive competitor research
- **👥 Smart Investor Matching** - Connect with VCs, angel investors, and accelerators using intelligent algorithms
- **💼 Portfolio Builder** - Create professional, investor-ready business portfolios
- **📱 Swipe Interface** - Intuitive mobile-first design for browsing projects and making connections
- **💬 Real-time Messaging** - Seamless communication between entrepreneurs and investors
- **📈 Investment Tracking** - Comprehensive dashboard for managing investment portfolios
- **🎯 Deal Flow Management** - Streamlined pipeline for investment opportunities

## 🏗️ Architecture

### Frontend Stack

- **Framework**: Next.js 15.5.0 with App Router
- **UI Library**: React 18 with TypeScript 5
- **Styling**: Tailwind CSS 3.4.17 with custom components
- **UI Components**: Radix UI primitives for accessibility
- **Animations**: Framer Motion for smooth interactions
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Zod validation

### Backend Stack

- **Database**: PostgreSQL with Prisma ORM 6.14.0
- **Authentication**: Clerk for user management
- **AI Integration**: Google Gemini API for project analysis
- **API Routes**: Next.js API routes with TypeScript
- **File Handling**: Svix for webhooks

### Design System

- **Component Library**: Custom shadcn/ui components
- **Theme**: Dark/Light mode support with next-themes
- **Icons**: Lucide React icon library
- **Typography**: Geist font family
- **Responsive**: Mobile-first design with desktop views

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **pnpm** (recommended) - `npm install -g pnpm`
- **Git** - [Download here](https://git-scm.com/)
- **PostgreSQL Database** - Local installation or cloud service (Neon, Supabase, etc.)

### Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/curtainteddy/LSPP-swipetank.git
   cd LSPP-swipetank
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Environment Configuration**

   Copy the example environment file:

   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your configuration:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/swipetank"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

   # Google Gemini AI
   GEMINI_API_KEY=your_gemini_api_key

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Database Setup**

   Generate Prisma client:

   ```bash
   pnpm prisma generate
   ```

   Run database migrations:

   ```bash
   pnpm prisma db push
   ```

   Seed the database with sample data:

   ```bash
   pnpm run db:seed
   ```

5. **Start the development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
# Generate Prisma client and build
pnpm build

# Start production server
pnpm start
```

### Database Management

```bash
# Reset database and reseed
pnpm run db:reset

# View database in Prisma Studio
pnpm prisma studio

# Generate Prisma client after schema changes
pnpm prisma generate

# Apply schema changes to database
pnpm prisma db push
```

## 📱 User Roles & Features

### 🧑‍💼 Entrepreneurs

- **Project Management**: Create and manage startup projects
- **Analytics Dashboard**: Track project performance and metrics
- **Portfolio Builder**: Showcase projects to potential investors
- **Investor Discovery**: Browse and connect with relevant investors
- **Funding Tracking**: Monitor investment rounds and funding progress

### 💰 Investors

- **Deal Flow**: Browse curated startup opportunities
- **Investment Tracking**: Monitor portfolio performance and ROI
- **Due Diligence**: Access comprehensive project analytics
- **Messaging**: Direct communication with entrepreneurs
- **Preferences**: Set investment criteria and preferences

### 🔄 Swipe Mechanism

- **Smart Matching**: AI-powered recommendations based on preferences
- **Quick Actions**: Swipe right to express interest, left to pass
- **Mutual Connections**: Chat unlocked when both parties show interest
- **Saved Projects**: Bookmark interesting opportunities for later review

## 🗂️ Project Structure

```
LSPP-swipetank/
├── app/                          # Next.js 15 App Router
│   ├── globals.css              # Global styles and CSS variables
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Landing page
│   ├── (auth)/                  # Route groups for auth
│   │   ├── sign-in/             # Clerk sign-in pages
│   │   ├── sign-up/             # Clerk sign-up pages
│   │   └── user-profile/        # User profile management
│   ├── api/                     # API routes
│   │   ├── analysis/            # AI analysis endpoints
│   │   ├── dashboard/           # Dashboard data
│   │   ├── investments/         # Investment CRUD
│   │   ├── messages/            # Messaging system
│   │   └── projects/            # Project management
│   ├── browse/                  # Project discovery/swipe interface
│   ├── dashboard/               # User dashboard
│   ├── analytics/               # Analytics and insights
│   ├── portfolio/               # Portfolio management
│   ├── deals/                   # Deal flow for investors
│   ├── investments/             # Investment tracking
│   ├── messages/                # Messaging interface
│   ├── profile/                 # User profile pages
│   ├── projects/                # Project management
│   │   ├── new/                 # Create new project
│   │   └── [id]/edit/          # Edit existing project
│   ├── saved/                   # Saved/bookmarked projects
│   └── settings/                # User settings
├── components/                   # Reusable React components
│   ├── ui/                      # shadcn/ui base components
│   │   ├── button.tsx           # Button variants
│   │   ├── card.tsx             # Card components
│   │   ├── dialog.tsx           # Modal dialogs
│   │   ├── form.tsx             # Form components
│   │   └── [50+ other components]
│   ├── layout/                  # Layout components
│   │   ├── app-layout.tsx       # Main app wrapper
│   │   ├── sidebar.tsx          # Navigation sidebar
│   │   └── top-navigation.tsx   # Top navigation bar
│   ├── landing/                 # Landing page components
│   ├── browse/                  # Swipe interface components
│   ├── dashboard/               # Dashboard widgets
│   ├── analytics/               # Charts and analytics
│   ├── projects/                # Project management UI
│   ├── messages/                # Chat interface
│   └── theme-provider.tsx       # Dark/light theme provider
├── contexts/                     # React Context providers
│   └── user-context.tsx        # User role and state management
├── hooks/                       # Custom React hooks
│   ├── use-mobile.tsx           # Mobile detection hook
│   └── use-toast.ts             # Toast notification hook
├── lib/                         # Utility functions and configs
│   ├── auth.ts                  # Authentication helpers
│   ├── auth-helpers.ts          # Clerk integration utilities
│   ├── prisma.ts                # Database client singleton
│   └── utils.ts                 # General utility functions
├── prisma/                      # Database schema and migrations
│   ├── schema.prisma            # Database schema definition
│   ├── seed.ts                  # Database seeding script
│   └── migrations/              # Database migration files
├── public/                      # Static assets
│   ├── logo.png                 # Application logo
│   ├── studymate.png           # Default project image
│   ├── favicon.ico              # Site favicon
│   └── placeholder-*.jpg        # Placeholder images
├── styles/                      # Additional stylesheets
│   └── globals.css              # Global CSS imports
├── middleware.ts                # Next.js middleware for auth
├── next.config.mjs              # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── components.json              # shadcn/ui configuration
└── package.json                 # Dependencies and scripts
```

## 🎨 Key Components

### Landing Page

- Hero section with gradient animations
- Feature showcase with interactive cards
- Testimonials and success stories
- Call-to-action sections

### Swipe Interface

- Card-based project browsing
- Gesture controls for mobile
- Smooth animations and transitions
- Desktop and mobile optimized views

### Analytics Dashboard

- Real-time metrics and KPIs
- Interactive charts and graphs
- Competitor analysis tools
- Market gap identification

### Portfolio Builder

- Drag-and-drop project organization
- Professional templates
- Export to PDF functionality
- Investor-ready presentations

## 🔧 Configuration

## ⚙️ Configuration

### Required Services Setup

#### 1. Database (PostgreSQL)

- **Local**: Install PostgreSQL locally
- **Cloud**: Use Neon, Supabase, or Railway
- Create a database named `swipetank`
- Update `DATABASE_URL` in `.env.local`

#### 2. Clerk Authentication

1. Create account at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy the publishable and secret keys
4. Configure sign-in/sign-up URLs
5. Set up webhooks for user sync (optional)

#### 3. Google Gemini AI

1. Visit [Google AI Studio](https://aistudio.google.com)
2. Create a new API key
3. Add to `GEMINI_API_KEY` in environment variables

### Environment Variables

Complete `.env.local` configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@host:5432/swipetank"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

- **Netlify**: Add build command `pnpm build` and publish directory `.next`
- **Railway**: Connect database and add environment variables
- **Docker**: Use the included Dockerfile for containerized deployment

### Production Checklist

- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] Clerk webhooks set up (if using)
- [ ] Domain configured in Clerk dashboard
- [ ] Analytics and monitoring set up

## 🔧 Troubleshooting

### Common Issues

**Prisma Client Not Found**

```bash
pnpm prisma generate
```

**Database Connection Issues**

- Check DATABASE_URL format
- Ensure database server is running
- Verify network connectivity

**Build Failures**

- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && pnpm install`
- Check TypeScript errors: `pnpm type-check`

**Authentication Issues**

- Verify Clerk keys are correct
- Check domain configuration in Clerk
- Ensure webhook URLs are accessible

### Development Tips

- Use `pnpm dev --turbo` for faster development
- Install React DevTools for debugging
- Use Prisma Studio for database inspection
- Check browser console for client-side errors

### Tailwind Configuration

The project uses a custom Tailwind configuration with:

- Custom color schemes for dark/light themes
- Design tokens for consistent spacing
- Component-specific utilities
- Responsive breakpoints
- Animation classes

## 📜 Available Scripts

```bash
# Development
pnpm dev                    # Start development server
pnpm build                  # Build for production
pnpm start                  # Start production server
pnpm lint                   # Run ESLint

# Database Management
pnpm prisma generate        # Generate Prisma client
pnpm prisma db push         # Push schema changes to database
pnpm prisma studio          # Open Prisma Studio
pnpm run db:seed           # Seed database with sample data
pnpm run db:reset          # Reset and reseed database

# Utilities
pnpm type-check            # Check TypeScript types
pnpm format                # Format code with Prettier
```

## 🤝 Contributing

We welcome contributions from the community! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Follow existing code style and patterns
   - Add TypeScript types for new features
   - Update documentation if needed
4. **Test your changes**

   ```bash
   pnpm build          # Ensure it builds successfully
   pnpm type-check     # Check for TypeScript errors
   pnpm lint           # Fix any linting issues
   ```

5. **Commit your changes**

   ```bash
   git commit -m 'feat: add amazing feature'
   ```

6. **Push to the branch**

   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request**

### Development Guidelines

- **Code Style**: Follow existing TypeScript and React patterns
- **Components**: Use shadcn/ui components when possible
- **Styling**: Use Tailwind CSS classes, avoid custom CSS
- **Database**: Update Prisma schema for data model changes
- **API**: Follow REST conventions for API routes
- **Authentication**: Integrate with Clerk for user management
- **Testing**: Add tests for complex business logic
- **Documentation**: Update README for new features

### Commit Convention

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation updates
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions or updates
- `chore:` Build/config changes

## 📚 Resources & Documentation

### Design System

- [Component Library](./docs/components.md)
- [Design Tokens](./docs/design-tokens.md)
- [Accessibility Guidelines](./docs/accessibility.md)

### API Documentation

- [API Reference](./docs/api.md)
- [Authentication](./docs/auth.md)
- [Data Models](./docs/models.md)

### Tutorials

- [Getting Started Guide](./docs/getting-started.md)
- [Deployment Guide](./docs/deployment.md)
- [Customization Guide](./docs/customization.md)

---

<div align="center">

**Made with ❤️ by the Team GamaKichi**
[GitHub](https://github.com/curtainteddy/lspp-swipetank)

</div>
