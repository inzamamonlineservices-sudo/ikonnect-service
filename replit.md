# Ikonnect Service - Digital Agency Website

## Overview
Ikonnect Service is a modern, multi-page digital agency website built to showcase services including data automation, web development, AI chatbots, web extraction, and graphic design. The application features a full-stack architecture with a React-based frontend using shadcn/ui components, an Express backend with REST APIs, and PostgreSQL database integration through Drizzle ORM. The site emphasizes professional presentation with modern animations, responsive design, and comprehensive service showcases including portfolio displays, blog functionality, and client testimonials.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built with **React** using **TypeScript** and leverages modern UI patterns:
- **Component Library**: shadcn/ui with Radix UI primitives for accessible, customizable components
- **Styling**: TailwindCSS with custom color scheme and design tokens for consistent theming
- **Routing**: Wouter for lightweight client-side navigation
- **State Management**: TanStack Query for server state management with caching and synchronization
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Build Tool**: Vite for fast development and optimized production builds

The frontend follows a page-based architecture with dedicated routes for Home, Services, Portfolio, About, Blog, and Contact sections. Each service has individual detail pages, and the portfolio/blog systems support detailed views with dynamic routing.

### Backend Architecture
The server implements a **RESTful API** using **Express.js**:
- **API Endpoints**: Contact form submissions (`/api/contact`) and newsletter subscriptions (`/api/newsletter`)
- **Middleware**: JSON parsing, CORS handling, request logging, and error handling
- **Development Integration**: Vite middleware integration for seamless full-stack development
- **Storage Interface**: Abstracted storage layer supporting both in-memory (development) and database implementations

The backend uses TypeScript throughout and implements proper error handling with structured JSON responses.

### Database Design
**PostgreSQL** database managed through **Drizzle ORM**:
- **Schema Management**: Centralized schema definitions with TypeScript types
- **Tables**: Users, contacts, newsletters, portfolio items, blog posts, and testimonials
- **Type Safety**: Drizzle-zod integration for runtime validation matching database schema
- **Migrations**: Automated migration system for database versioning

Key design decisions include using UUIDs for primary keys, JSONB fields for flexible data storage (tags, technologies), and proper indexing for performance.

### Authentication & Security
- **Session Management**: Planned integration with connect-pg-simple for PostgreSQL-backed sessions
- **Input Validation**: Zod schemas for all API inputs with comprehensive error handling
- **Security Headers**: Standard Express security middleware configuration

### Performance Optimizations
- **Code Splitting**: Vite's automatic code splitting for optimal bundle sizes
- **Image Optimization**: Responsive images with proper loading strategies
- **Caching**: TanStack Query provides intelligent client-side caching
- **Static Assets**: Optimized asset handling through Vite's build process

### Design System
- **Typography**: Multi-font system (Inter, IBM Plex Mono, custom fonts)
- **Color System**: Comprehensive design token system with CSS custom properties
- **Component Variants**: Class-variance-authority for systematic component variations
- **Responsive Design**: Mobile-first approach with consistent breakpoints

The architecture prioritizes maintainability through TypeScript throughout, separation of concerns, and a clear component hierarchy that supports the agency's professional presentation requirements.

## External Dependencies

### Core Frameworks & Libraries
- **React 18** with TypeScript for the frontend framework
- **Express.js** for the Node.js backend server
- **Vite** as the build tool and development server

### Database & ORM
- **PostgreSQL** as the primary database (configured for Neon serverless)
- **Drizzle ORM** for type-safe database operations and schema management
- **Drizzle Kit** for database migrations and schema management

### UI & Styling
- **shadcn/ui** component library built on Radix UI primitives
- **TailwindCSS** for utility-first styling
- **Radix UI** components for accessible UI primitives
- **Class Variance Authority** for component variant management
- **Lucide React** for icon system

### State Management & Data Fetching
- **TanStack React Query** for server state management and caching
- **React Hook Form** with **Hookform Resolvers** for form state management
- **Zod** for schema validation and type inference

### Development & Build Tools
- **TypeScript** for type safety across the full stack
- **ESBuild** for server-side bundling
- **PostCSS** with Autoprefixer for CSS processing
- **TSX** for TypeScript execution in development

### Enhanced Features
- **Embla Carousel React** for image carousels and sliders
- **Date-fns** for date manipulation
- **Wouter** for lightweight client-side routing
- **CLSX** and **Tailwind Merge** for conditional styling

### Development Integrations
- **Replit Vite Plugins** for development environment integration
- **Connect PG Simple** for PostgreSQL session storage
- **Nanoid** for unique identifier generation

The dependency choices prioritize modern development practices, type safety, performance, and maintainability while supporting the rich interactive features required for a professional digital agency website.