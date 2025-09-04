# Basic Project Structure

## Overview

This is an Angular 19 enterprise application built with standalone components architecture. The project uses TypeScript, Angular Material UI, and follows a feature-based organization pattern.

## Application Bootstrap

- **`src/main.ts`** - Entry point that bootstraps the application using `bootstrapApplication`
- **`src/app/app.config.ts`** - Application configuration with providers, interceptors, and services
- **`src/app/app.component.ts`** - Root component with layout and routing logic
- **`src/app/app.routes.ts`** - Central routing configuration (362 lines)

## Core Directory Structure

### `src/app/core/`
Infrastructure layer containing shared services, utilities, and business logic.

**API Services (`api/`)**
- HTTP client services for backend communication
- Key services: `client-api.service.ts`, `mp-reservation-orders.service.ts`, `client-proposails-api.service.ts`
- Domain-specific APIs for each business module

**Models (`models/`)**
- TypeScript interfaces and types
- Organized by feature domains: `auth/`, `company/`, `excess-income/`, `production-plan/`
- Common models: `user-profile.ts`, `form.ts`, `search-type.ts`

**Services (`services/`)**
- Core business services: `authentication.service.ts`, `cookies.service.ts`
- Cross-cutting concerns and utilities

**Facades (`facades/`)**
- Business logic orchestration layer
- Abstracts complex operations from components

**Interceptors (`interceptors/`)**
- HTTP interceptors: `jwt.interceptor.ts`, `error.interceptor.ts`

**Guards (`guards/`)**
- Route protection: `auth.guard.ts`, permission-based guards

**States (`states/`)**
- Application state management services
- Store services for shared data

**Utilities**
- `pipes/` - Custom Angular pipes
- `utils/` - Helper functions and utilities
- `validators/` - Form validation logic
- `animations/` - Reusable animations
- `constants/` - Application constants

### `src/app/pages/`
Feature modules organized as standalone components.

**Authentication (`auth/`)**
- `auth.component.ts` - Authentication wrapper
- `sign-in/`, `forgot-password/`, `reset-password/` - Auth flows

**Business Features**
- `mp-reservation-orders/`, `mp-reservation-order-card/` - Material planning
- `excess-income/` - Financial management
- `client-proposals-page/` - Client proposal management
- `production-plan/` - Production planning
- `client-card/` - Client relationship management
- `completed-work-acts/` - Work completion tracking
- `raw-material-accounting/` - Inventory management

**User Management**
- `profile/` - User profile and settings
- `main-page/` - Dashboard/home page
- `clients-list-page/` - Client directory

### `src/app/shared/`
Reusable UI components and utilities.

**Components (`components/`)**
- Common UI components used across features
- Buttons, forms, tables, modals, etc.

**Layouts (`layouts/`)**
- Page layout components
- Different layout variations for various page types

**Pipes (`pipe/`)**
- Shared Angular pipes for data transformation

**Types (`types/`)**
- Shared TypeScript type definitions

**Theme (`theme/`)**
- Styling and theming utilities

### `src/app/widgets/`
Dashboard widgets and standalone UI components.

**Available Widgets**
- `address-book/` - Contact management widget
- `auction-sales/` - Sales auction widget
- `birthday/` - Birthday notifications
- `chat-bot/` - Chat interface
- `correspondence/` - Communication widget
- `exchange-rates/` - Currency exchange rates
- `history/` - Activity history
- `rating/` - Rating and reviews
- `transport/` - Transportation tracking
- `victory/` - Achievement/success notifications

## Configuration

### Environment Files (`src/environments/`)
- `environment.ts` - Base environment
- `environment.development.ts` - Development configuration
- `environment.staging.ts` - Staging environment
- `environment.prod.ts` - Production configuration

### Build Configuration
- `angular.json` - Angular CLI workspace configuration
- `package.json` - Dependencies and scripts
- `tsconfig.*.json` - TypeScript compilation settings

## Key Architectural Patterns

### Standalone Components
All components are built as standalone, eliminating the need for NgModules. Components declare their dependencies directly in the `imports` array.

### Dependency Injection
Services use Angular's DI system with `providedIn: 'root'` for singleton services. Components inject dependencies through constructor injection.

### Routing Architecture
Centralized routing in `app.routes.ts` with nested routes for features. Uses layout components to wrap different page types.

### State Management
Custom state management using services and facades rather than NgRx. State is managed through singleton services with observables.

### API Integration
RESTful API communication through dedicated service classes in `core/api/`. HTTP interceptors handle authentication and error management.

## File Naming Conventions

- Components: `*.component.ts`
- Services: `*.service.ts`
- Guards: `*.guard.ts`
- Pipes: `*.pipe.ts`
- Models/Interfaces: `*.ts` (descriptive names)
- API Services: `*-api.service.ts`

## Import Aliases

The project uses path mapping for clean imports:
- `@app/*` - Maps to `src/app/*`
- `@auth/*` - Maps to `src/app/pages/auth/*`

This structure supports enterprise-scale development with clear separation of concerns, reusable components, and maintainable architecture.
