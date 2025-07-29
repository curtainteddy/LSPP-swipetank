# 🚀 SwipeTank - Transform Ideas Into Startups

<div align="center">

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
- **Framework**: Next.js 14.2.16 with App Router
- **UI Library**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Radix UI primitives for accessibility
- **Animations**: Framer Motion for smooth interactions
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Zod validation

### Design System
- **Component Library**: Custom shadcn/ui components
- **Theme**: Dark/Light mode support with next-themes
- **Icons**: Lucide React icon library
- **Typography**: Geist font family
- **Responsive**: Mobile-first design with desktop views

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Git

### Installation

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

3. **Start the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
pnpm build
pnpm start
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
swipetankmain/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   ├── auth/                    # Authentication pages
│   ├── dashboard/               # Dashboard pages
│   ├── analytics/               # Analytics pages
│   └── [other routes]/          # Feature-specific pages
├── components/                   # Reusable components
│   ├── ui/                      # Base UI components (shadcn/ui)
│   ├── layout/                  # Layout components
│   ├── landing/                 # Landing page components
│   ├── auth/                    # Authentication components
│   ├── dashboard/               # Dashboard components
│   ├── analytics/               # Analytics components
│   ├── portfolio/               # Portfolio components
│   ├── deals/                   # Deal flow components
│   ├── investments/             # Investment tracking
│   ├── messages/                # Messaging components
│   └── [feature]/               # Feature-specific components
├── contexts/                     # React Context providers
│   └── user-context.tsx        # User state management
├── hooks/                       # Custom React hooks
├── lib/                         # Utility functions
├── public/                      # Static assets
├── styles/                      # Additional styles
└── types/                       # TypeScript type definitions
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

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# Add your environment variables here
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Add database, authentication, and API configurations
```

### Tailwind Configuration
The project uses a custom Tailwind configuration with:
- Custom color schemes
- Design tokens
- Component-specific styles
- Responsive breakpoints
- Dark mode support


## 🤝 Contributing

We welcome contributions from the community! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed


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