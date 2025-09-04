# Naming Conventions

## File Naming

### Components
- **Pattern**: `kebab-case.component.ts`
- **Examples**: `mp-reservation-order-card.component.ts`, `client-proposals-page.component.ts`

### Services
- **Pattern**: `kebab-case.service.ts`
- **Examples**: `authentication.service.ts`, `mp-reservation-orders.service.ts`

### API Services
- **Pattern**: `kebab-case-api.service.ts`
- **Examples**: `client-api.service.ts`, `notifications-api.service.ts`

### Models/Interfaces
- **Pattern**: `kebab-case.ts`
- **Examples**: `user-profile.ts`, `friend-account-dto.ts`

### Pipes
- **Pattern**: `kebab-case.pipe.ts`
- **Examples**: `num-with-spaces.pipe.ts`, `md-to-html.pipe.ts`

### Guards
- **Pattern**: `kebab-case.guard.ts`
- **Examples**: `auth.guard.ts`, `excess-income-permission.guard.ts`

### Enums
- **Pattern**: `kebab-case-enum.ts`
- **Examples**: `correspondence-type-enum.ts`

### Utilities
- **Pattern**: `kebab-case.ts`
- **Examples**: `date.ts`, `filter-builder.util.ts`

## Class Naming

### Components
- **Pattern**: `PascalCase` + `Component` suffix
- **Examples**: `MpReservationOrderCardComponent`, `AuthenticationService`

### Services
- **Pattern**: `PascalCase` + `Service` suffix
- **Examples**: `AuthenticationService`, `ClientApiService`

### Facades
- **Pattern**: `PascalCase` + `FacadeService` suffix
- **Examples**: `MpReservationOrderCardFacadeService`, `PermissionsFacadeService`

### Pipes
- **Pattern**: `PascalCase` + `Pipe` suffix
- **Examples**: `NumWithSpacesPipe`, `MdToHtmlPipe`

### Guards
- **Pattern**: `PascalCase` + `Guard` suffix
- **Examples**: `AuthGuard`, `ExcessIncomePermissionGuard`

## Interface and Type Naming

### Interfaces
- **Pattern**: `I` prefix + `PascalCase`
- **Examples**: `IUserProfile`, `IFriendAccountDto`

### DTOs (Data Transfer Objects)
- **Pattern**: `I` prefix + `PascalCase` + `Dto` suffix
- **Examples**: `IClientDataDto`, `IManagerItemDto`

### Type Aliases
- **Pattern**: `PascalCase`
- **Examples**: `Cell`, `ButtonType`

### Filters
- **Pattern**: `I` prefix + `PascalCase` + `Filter` suffix
- **Examples**: `IClientsFilter`, `IBusinessTripsFilter`

## Enum Naming

### Enum Declaration
- **Pattern**: `PascalCase` + `Enum` suffix
- **Examples**: `CorrespondenceTypeEnum`, `TooltipTheme`

### Enum Values
- **Pattern**: `PascalCase`
- **Examples**: `Clients`, `Personifications`, `CompletedWorkActs`

## Variable and Property Naming

### Class Properties
- **Pattern**: `camelCase`
- **Examples**: `userSubject`, `avatarUrl`, `departmentId`

### Private Properties
- **Pattern**: `camelCase` with `private readonly` when applicable
- **Examples**: `private readonly userSubject`, `private readonly headers`

### Public Properties
- **Pattern**: `camelCase`
- **Examples**: `public user$`, `public userValue`

### Observable Properties
- **Pattern**: `camelCase` + `$` suffix
- **Examples**: `user$`, `loading$`

### Signal Properties
- **Pattern**: `camelCase`
- **Examples**: `orders`, `loading`, `selectedOrderId`

### Constants
- **Pattern**: `SCREAMING_SNAKE_CASE`
- **Examples**: `CLIENT_MANAGERS_CAN_ADD_MANAGERS`, `COMPLETED_WORK_ACTS_ACCESS`

## Method Naming

### Public Methods
- **Pattern**: `camelCase` with descriptive verbs
- **Examples**: `login()`, `getClientCardById()`, `setOrders()`

### Private Methods
- **Pattern**: `camelCase` with descriptive verbs
- **Examples**: `updateState()`, `numberWithSpaces()`

### API Methods
- **Pattern**: HTTP verb + descriptive noun
- **Examples**: `getClients()`, `getManagers()`, `getClientStatuses()`

### Event Handlers
- **Pattern**: `on` + `PascalCase`
- **Examples**: `onClick()`, `onSubmit()`, `onValueChange()`

### Utility Functions
- **Pattern**: `camelCase` with descriptive verbs
- **Examples**: `dateTimeFromIsoString()`, `getTime()`

## Component Selector Naming

### Application Components
- **Pattern**: `app-kebab-case`
- **Examples**: `app-mp-reservation-order-card`, `app-client-proposals-page`

### Shared Components
- **Pattern**: `ss-kebab-case` (ss = shared system)
- **Examples**: `ss-table`, `ss-divider`

## Directory Naming

### Feature Directories
- **Pattern**: `kebab-case`
- **Examples**: `mp-reservation-orders`, `client-proposals-page`, `excess-income`

### Shared Directories
- **Pattern**: `kebab-case`
- **Examples**: `shared/components`, `core/services`, `core/models`

### Model Subdirectories
- **Pattern**: `kebab-case` matching feature names
- **Examples**: `auth/`, `company/`, `production-plan/`

## Import Alias Naming

### Path Aliases
- **Pattern**: `@kebab-case`
- **Examples**: `@app/*`, `@auth/*`, `@environments/*`

### Component Imports
- **Pattern**: Import exact class name
- **Examples**: `import { AuthenticationService }`, `import { IUserProfile }`

## Template Naming

### Template Variables
- **Pattern**: `camelCase`
- **Examples**: `let item of items`, `let user of users`

### Template Reference Variables
- **Pattern**: `camelCase`
- **Examples**: `#userForm`, `#tableRef`

### CSS Classes
- **Pattern**: `kebab-case`
- **Examples**: `order-item`, `client-card-container`

## Best Practices

### Consistency Rules
- Always use the same pattern for similar entities
- Prefix interfaces with `I` for clear type distinction
- Use descriptive names that explain purpose
- Avoid abbreviations except for common cases (`Dto`, `Api`)

### Semantic Naming
- Methods should start with verbs (`get`, `set`, `create`, `update`, `delete`)
- Boolean properties should use `is`, `has`, `can` prefixes
- Event emitters should use `on` prefix or past tense verbs

### File Organization
- Group related files in feature directories
- Use barrel exports (`index.ts`) for clean imports
- Keep naming consistent across components, services, and models within features
