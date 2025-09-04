# Architectural Patterns

## Overview

This Angular application follows a layered architecture with clear separation of concerns using established design patterns. The architecture emphasizes standalone components, dependency injection, and reactive programming principles.

## Core Architectural Layers

### Presentation Layer
- **Components**: UI logic and user interaction
- **Layouts**: Structural composition of pages
- **Pipes**: Data transformation for templates

### Business Logic Layer
- **Facades**: Orchestration of business operations
- **Services**: Core business logic and utilities
- **States**: Application state management

### Data Access Layer
- **API Services**: HTTP communication with backend
- **Interceptors**: Cross-cutting HTTP concerns
- **Models**: Data structures and interfaces

## Design Patterns

### 1. Facade Pattern

**Purpose**: Simplifies complex business operations by providing a unified interface to multiple services.

**Implementation**: Located in `core/facades/`
- Orchestrates multiple API calls and business logic
- Manages component state using BehaviorSubjects
- Handles loading states and error management

**When to Use**:
- Complex components requiring multiple API services
- Business operations spanning multiple data sources
- Stateful operations requiring coordination

**Example**: `MpReservationOrderCardFacadeService` coordinates order management, permissions, and warehouse data.

### 2. Repository Pattern (API Services)

**Purpose**: Abstracts data access logic and provides a consistent interface for backend communication.

**Implementation**: Located in `core/api/`
- Each service handles a specific domain (clients, orders, notifications)
- Returns observables for reactive data flow
- Standardized HTTP operations (GET, POST, PUT, DELETE)

**When to Use**:
- All backend data access
- Consistent API communication patterns
- Domain-specific data operations

**Example**: `ClientApiService` provides all client-related data operations.

### 3. State Management Pattern

**Purpose**: Manages application state using BehaviorSubjects for reactive state updates.

**Implementation**: Located in `core/states/`
- Centralized state containers using BehaviorSubjects
- Reactive state updates through observables
- Immutable state modifications

**When to Use**:
- Shared state across multiple components
- Complex state that needs persistence
- Cross-component communication

**Example**: `MainMenuStoreService` manages global menu state.

### 4. Interceptor Pattern

**Purpose**: Implements cross-cutting concerns for HTTP requests/responses.

**Implementation**: Located in `core/interceptors/`
- JWT authentication attachment
- Global error handling
- Request/response transformation

**When to Use**:
- Authentication token management
- Global error handling
- Request logging or modification
- Response transformation

**Example**: `JwtInterceptor` automatically adds authentication headers.

### 5. Guard Pattern

**Purpose**: Controls route access based on authentication and authorization rules.

**Implementation**: Located in `core/guards/`
- Route protection based on authentication state
- Role-based access control
- Redirect logic for unauthorized access

**When to Use**:
- Authentication-protected routes
- Role-based route access
- Navigation guards for unsaved changes

**Example**: `AuthGuard` protects routes requiring authentication.

### 6. Component Composition Pattern

**Purpose**: Creates reusable UI components through composition and input/output binding.

**Implementation**: Standalone components with clear interfaces
- Input properties for data binding
- Output events for communication
- Lifecycle hooks for initialization
- OnPush change detection for performance

**When to Use**:
- Reusable UI elements
- Complex UI component hierarchies
- Performance-critical components

**Example**: `TableComponent` provides reusable table functionality.

### 7. Modal Service Pattern

**Purpose**: Centralized modal management using Angular CDK Overlay.

**Implementation**: Located in `core/modal/`
- Dynamic component creation
- Overlay positioning and backdrop management
- Data injection through DI tokens

**When to Use**:
- Dynamic modal dialogs
- Component-based overlays
- Centralized modal state management

**Example**: `ModalService` creates and manages modal dialogs.

### 8. Layout Pattern

**Purpose**: Provides consistent page structure through layout components.

**Implementation**: Located in `shared/layouts/`
- Composition-based layouts using router outlet
- Different layouts for various page types
- Header, footer, and content area management

**When to Use**:
- Consistent page structure
- Different layout requirements
- Shared navigation and footer elements

**Example**: `FullLayoutComponent` provides header, content, and footer structure.

### 9. Pipe Pattern

**Purpose**: Transforms data for display purposes in templates.

**Implementation**: Located in `core/pipes/` and `shared/pipe/`
- Pure pipes for performance
- Standalone pipes for modern Angular
- Domain-specific transformations

**When to Use**:
- Data formatting in templates
- Security transformations (HTML sanitization)
- Reusable data transformations

**Example**: `NumWithSpacesPipe` formats numbers with space separators.

### 10. Response Wrapper Pattern

**Purpose**: Standardizes API response structure across the application.

**Implementation**: Located in `core/utils/response.ts`
- Generic response interfaces
- Pagination and metadata support
- Domain-specific response extensions

**When to Use**:
- Consistent API response handling
- Pagination requirements
- Metadata alongside data

**Example**: `IResponse<T>` provides standard structure for paginated data.

## Reactive Programming Patterns

### Observable Data Flow
- Services expose data through observables
- Components subscribe to reactive streams
- Automatic memory management with `untilDestroyed`

### BehaviorSubject State Management
- Current value accessibility
- Multicast to multiple subscribers
- State persistence across subscriptions

### Error Handling
- Centralized error handling through interceptors
- Component-level error boundaries
- Graceful degradation patterns

## Dependency Injection Patterns

### Constructor Injection
- Service dependencies injected through constructors
- `private readonly` for immutable dependencies
- Clear dependency declaration

### Modern Inject Function
- `inject()` function for standalone components
- Cleaner syntax for dependency injection
- Framework-agnostic dependency access

### Service Registration
- `providedIn: 'root'` for singleton services
- Tree-shakable services
- Lazy loading compatible

## Animation Patterns

### Reusable Animations
- Centralized animation definitions in `core/animations/`
- Parameterized animations for flexibility
- Trigger-based animations for state changes

### Route Animations
- Page transition animations
- Consistent navigation experience
- Performance-optimized transitions

## Best Practices

### Pattern Selection Guidelines
- Use facades for complex business operations
- Implement guards for route protection
- Apply interceptors for cross-cutting concerns
- Utilize pipes for data transformation
- Employ state services for shared data

### Performance Considerations
- OnPush change detection for components
- Pure pipes for transformations
- Lazy loading for route modules
- Reactive programming for efficient updates

### Maintainability
- Clear separation of concerns
- Consistent pattern application
- Dependency injection for testability
- Observable-based reactive programming
