# Services

## Service Architecture Overview

The project uses a layered service architecture with three main service types:
- **Core Services** - Basic infrastructure and utilities
- **API Services** - HTTP communication with backend
- **Facade Services** - Business logic orchestration and state management
- **State Services** - Application state management

## Core Services

### Authentication Service

**Purpose**: Manages user authentication, session state, and security operations.

**Key Methods**:
- `login(username: string, password: string)` - Authenticates user with credentials
- `logout()` - Terminates user session and clears storage
- `enterUnderFriendlyAccount(userId: number, returnUrl: string)` - Switch user context
- `resetPasswordRequest(login: string)` - Initiates password reset
- `resetPassword(body: ResetPasswordDto)` - Completes password reset

**Data Input**: Username/password credentials, user IDs, reset tokens
**Data Output**: User objects with JWT tokens, authentication status
**State Management**: Maintains current user via BehaviorSubject with localStorage persistence

**Usage Example**:
```typescript
// Login user
this.authService.login(username, password).subscribe(user => {
  // User logged in successfully
});

// Access current user
const currentUser = this.authService.userValue;
```

### Local Storage Service

**Purpose**: Provides reactive localStorage wrapper with error handling and change notifications.

**Key Methods**:
- `setItem(key: string, value: any)` - Store data with automatic JSON serialization
- `getItem<T>(key: string): T | null` - Retrieve and deserialize data
- `removeItem(key: string)` - Remove specific item
- `clear()` - Clear all localStorage data

**Data Input**: Key-value pairs, any serializable objects
**Data Output**: Parsed objects, null for missing/invalid data
**State Management**: Emits change notifications via Observable

### Modal Service

**Purpose**: Manages dynamic modal dialogs using Angular CDK Overlay.

**Key Methods**:
- `open<T>(component: ComponentType<T>, config?: DialogConfig)` - Open modal with component

**Data Input**: Angular component class, configuration with data payload
**Data Output**: ModalRef for controlling dialog
**Features**: Centered positioning, backdrop, data injection, portal-based rendering

## Facade Services

### Client Card Facade Service

**Purpose**: Orchestrates client management operations and maintains client-related state.

**Key Methods**:
- `getClientById(id: number)` - Load complete client information
- `getManagers(id: number)` - Retrieve client managers
- `getContractors(id: number, isActiveOnly: boolean)` - Load client contractors
- `saveClientInfo(clientId: number, body: IClientEditRequest)` - Update client data
- `addManager(clientId: number, userId: number)` - Assign manager to client
- `removeManager(clientId: number, managerId: number)` - Remove manager assignment

**State Management**:
- `client$` - Current client data
- `managers$` - Client managers list
- `contractors$` - Client contractors list
- `permissions$` - User permissions for client operations

**Business Logic**:
- Validates manager assignments against regional constraints
- Handles client status transitions with permission checks
- Coordinates multiple API calls for complete client context

### MP Reservation Orders Facade Service

**Purpose**: Manages material planning reservations and production scheduling.

**Key Methods**:
- `getOrders(filters: MpReservationFilter)` - Retrieve filtered reservation orders
- `createOrder(order: IMpReservationAddOrder)` - Create new reservation order
- `approveOrder(orderId: number)` - Approve pending order
- `rejectOrder(orderId: number, reason: string)` - Reject order with reason
- `updateProvisionDate(orderId: number, date: string)` - Modify provision schedule

**State Management**:
- `orders$` - Current orders list with pagination
- `personificationStatuses$` - Available order statuses
- `queueOrders$` - Orders in processing queue

**Business Logic**:
- Validates material availability before order creation
- Implements approval workflow with role-based permissions
- Coordinates with production planning and inventory management
- Handles batch processing and optimal batch calculations

### Permissions Facade Service

**Purpose**: Manages user permissions and access control across application modules.

**Key Methods**:
- `getUserPermissions(module: PermissionsApiEnum)` - Load module-specific permissions
- `hasPermission(permission: string)` - Check specific permission
- `canAccess(module: ModulesWithPermissionsEnum)` - Verify module access

**State Management**:
- Module-specific permission signals for reactive UI updates
- Cached permissions to minimize API calls
- Permission validation for business operations

**Business Logic**:
- Implements role-based access control (RBAC)
- Handles permission inheritance and delegation
- Validates permissions before critical operations

### Client Proposals Facade Service

**Purpose**: Manages client proposals, quotes, and sales pipeline operations.

**Key Methods**:
- `getProposals(filters: any)` - Retrieve filtered proposals
- `createProposal(clientId: number, proposal: any)` - Create new proposal
- `updateProposalStatus(proposalId: number, status: string)` - Update proposal state
- `generateQuote(proposalId: number)` - Generate formal quote document
- `trackProposalProgress(proposalId: number)` - Monitor proposal lifecycle

**Business Logic**:
- Validates proposal data against client requirements
- Implements sales workflow with approval stages
- Handles pricing calculations and margin analysis
- Coordinates with production capacity and delivery schedules

## State Management Services

### Main Menu Store Service

**Purpose**: Manages application menu state and user customizations.

**Key Methods**:
- `setMainMenu(menu: IMenuItemDto[])` - Set complete menu structure
- `getMainMenu()` - Retrieve current menu
- `addFavoriteMenu(item: IMenuItemDto)` - Add item to favorites
- `deleteFavoriteMenu(item: IMenuItemDto, index: number)` - Remove favorite

**State Management**: BehaviorSubject-based reactive menu state
**Business Logic**: Handles menu personalization and favorites management

### User Profile Store Service

**Purpose**: Maintains user profile information and preferences.

**State Management**: User profile data, settings, and preferences
**Business Logic**: Validates profile updates and manages user preferences

## Real-time Communication Services

### Signal Service (SignalR)

**Purpose**: Provides real-time communication for live updates and notifications.

**Key Methods**:
- `startConnection(token: string, objectId: string, type: number)` - Initialize SignalR connection
- `subscribeToChanges(objectId: string, type: number)` - Subscribe to entity changes
- `stopConnection()` - Terminate real-time connection

**Data Input**: Authentication token, entity identifiers
**Data Output**: Real-time change notifications via observables
**Business Logic**: Handles automatic reconnection and change tracking

## Utility Services

### Call Phone Service

**Purpose**: Manages phone call integrations and communication features.

**Business Logic**: Handles phone number formatting and call initiation

### Router Service

**Purpose**: Provides enhanced routing capabilities and navigation utilities.

**Business Logic**: Manages complex navigation scenarios and route parameters

### Cookies Service

**Purpose**: Manages HTTP cookies with proper security and expiration handling.

**Key Methods**: Cookie get/set operations with security attributes

## Service Usage Patterns

### Facade Pattern Implementation
Facades orchestrate multiple API calls and business operations:
```typescript
// Complex operation involving multiple services
public async createClientWithManager(clientData: any, managerId: number) {
  const client = await this.clientApi.createClient(clientData);
  await this.clientApi.addManager(client.id, managerId);
  this.updateClientState(client);
  return client;
}
```

### State Synchronization
Services maintain reactive state for UI updates:
```typescript
// Reactive state updates
this.clientSubject.next(updatedClient);
this.managersSubject.next(updatedManagers);
```

### Error Handling
Services implement comprehensive error handling:
```typescript
// Error handling with user feedback
.pipe(
  catchError(error => {
    this.handleError(error);
    return throwError(error);
  })
)
```

### Permission Integration
Services validate permissions before operations:
```typescript
// Permission-based operation
if (this.permissionsService.hasPermission('CLIENT_EDIT')) {
  return this.updateClient(data);
}
```

## Best Practices

### Service Design
- **Single Responsibility**: Each service handles specific business domain
- **Reactive Programming**: Use observables for data flow and state management
- **Error Handling**: Implement comprehensive error handling and user feedback
- **Caching**: Cache frequently accessed data to improve performance

### State Management
- **BehaviorSubjects**: Use for maintaining current state values
- **Immutable Updates**: Always create new state objects
- **Cleanup**: Implement proper subscription cleanup with untilDestroyed

### API Integration
- **Consistent Interfaces**: Standardize API service methods
- **Type Safety**: Use TypeScript interfaces for all data
- **Loading States**: Manage loading indicators and user feedback

### Business Logic
- **Validation**: Implement business rule validation in facades
- **Coordination**: Use facades to coordinate multiple service operations
- **Permissions**: Integrate permission checks throughout business operations
