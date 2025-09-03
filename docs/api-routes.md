# API Routes and Application Routes

## Base Configuration

**API Base URL**: `https://erp-dev.ssnab.it`
**Application**: ERP SSNAB Management System
**Authentication**: JWT Bearer Token required for all protected routes

## Application Routes

### Authentication Routes

#### `/auth`
**Layout**: Without footer layout
**Access**: Public

- **`/auth/sign-in`** - User login page
- **`/auth/forgot-password`** - Password recovery request
- **`/auth/reset-password`** - Password reset with token

### Main Application Routes

#### `/` (Root)
**Layout**: Full layout with header and footer
**Access**: Authenticated users only
**Guard**: `AuthGuard`

- **`/`** - Main dashboard page
- **`/profile`** - User profile management
  - **`/profile/settings`** - User settings and basic information
  - **`/profile/change-password`** - Password change form
  - **`/profile/friendly-accounts`** - Friendly accounts management
  - **`/profile/my-menu`** - Personal menu customization
  - **`/profile/order-widgets`** - Widget ordering and arrangement
  - **`/profile/notifications`** - Notification preferences

#### Client Management Routes
**Layout**: Without footer layout
**Access**: Authenticated users

- **`/clients-list`** - Client directory listing
- **`/client-card/:id`** - Client details page
  - **`/client-card/:id/basic`** - Basic client information
  - **`/client-card/:id/sale-requests`** - Client sale requests
  - **`/client-card/:id/request-samples`** - Sample requests
  - **`/client-card/:id/new-products`** - New product requests
  - **`/client-card/:id/return-requests`** - Return requests
  - **`/client-card/:id/lost-products`** - Lost product tracking
  - **`/client-card/:id/contracts`** - Contract management
  - **`/client-card/:id/business-trips`** - Business trip records
  - **`/client-card/:id/birthdays`** - Birthday notifications

#### Business Operations Routes

- **`/raw-material-accounting`** - Raw material tracking
  - **Access**: `procurementsPermissionsGuard`
  - **`/raw-material-accounting/:id`** - Specific material details

- **`/mp-reservation-orders`** - Material planning orders
  - **Access**: `mpReservationOrdersPermissionsGuard`
  - **`/mp-reservation-orders/:id`** - Order details

- **`/client-proposals`** - Client proposal management
  - **Access**: `proposalsPermissionsGuard`
  - **`/client-proposals/:id`** - Proposal details with tabs:
    - Business trips, Development, News, Trade list, Samples, Contractors

- **`/excess-income`** - Excess income tracking
- **`/production-plan`** - Production planning
  - **`/production-plan/operational-plan`** - Operational planning details
  - **Access**: `operationPlanPermissionGuard`

- **`/completed-work-acts`** - Completed work documentation
  - **`/completed-work-acts/:id`** - Work act details

#### Utility Routes

- **`/invite`** - User invitation management
- **`/not-permission`** - Access denied page

## API Endpoints

### Authentication API

#### **POST** `/api/auth/login`
**Purpose**: User authentication
**Request Body**:
```json
{
  "username": "string",
  "password": "string"
}
```
**Response**: User object with JWT token
**Access**: Public

#### **POST** `/api/auth/changeUser`
**Purpose**: Switch to friendly account
**Request Body**:
```json
{
  "userId": "number",
  "returnUrl": "string"
}
```
**Response**: Updated user session
**Access**: Authenticated

### Client Management API

#### **POST** `/api/company/clients`
**Purpose**: Get filtered client list
**Request Body**: `IClientsFilter` object
**Response**: `IResponse<IClientItemDto>`
**Access**: Authenticated

#### **GET** `/api/company/clients/:id`
**Purpose**: Get client details by ID
**Parameters**: `id` (number) - Client ID
**Response**: `IClientDataDto`
**Access**: Authenticated

#### **GET** `/api/company/clients/:id/managers`
**Purpose**: Get client managers
**Parameters**: `id` (number) - Client ID
**Response**: `IManagerItemDto[]`
**Access**: Authenticated

#### **GET** `/api/company/clients/:id/contractors`
**Purpose**: Get client contractors
**Parameters**: 
- `id` (number) - Client ID
- `isActiveOnly` (boolean) - Filter active only
**Response**: `IContractorItemDto[]`
**Access**: Authenticated

#### **PUT** `/api/company/clients/:clientId/managers/:managerId`
**Purpose**: Set basic manager for client
**Parameters**: Client ID and Manager ID
**Response**: `IManagerItemDto`
**Access**: Authenticated

#### **POST** `/api/company/clients/:clientId/managers`
**Purpose**: Add manager to client
**Request Body**:
```json
{
  "userId": "number",
  "isMain": "boolean"
}
```
**Access**: Authenticated

#### **DELETE** `/api/company/clients/:clientId/managers/:managerId`
**Purpose**: Remove manager from client
**Response**: `IManagerItemDto`
**Access**: Authenticated

### MP Reservation Orders API

#### **POST** `/api/manufacturing/Personification/Personification/search`
**Purpose**: Search reservation orders
**Request Body**: `MpReservationFilter`
**Response**: 
```json
{
  "data": "IResponse<IMpReservationOrder>",
  "permissions": "string[]"
}
```
**Access**: Authenticated with permissions

#### **GET** `/api/manufacturing/personification/personification/:id`
**Purpose**: Get reservation order by ID
**Parameters**: `id` (string) - Order ID
**Response**: Order data with permissions
**Access**: Authenticated with permissions

### Dictionary API

#### **GET** `/api/company/Dictionary/clientStatuses`
**Purpose**: Get client status options
**Response**: `IResponse<IDictionaryItemDto>`
**Access**: Authenticated

#### **GET** `/api/company/Dictionary/regions`
**Purpose**: Get regions list
**Query Parameters**: `query` (string) - Search term
**Response**: `IResponse<IDictionaryItemDto>`
**Access**: Authenticated

#### **GET** `/api/company/Dictionary/subsectors`
**Purpose**: Get subsectors list
**Query Parameters**: `query` (string) - Search term
**Response**: `IResponse<IDictionaryItemDto>`
**Access**: Authenticated

### User Management API

#### **GET** `/api/auth/users/search`
**Purpose**: Search users by name
**Query Parameters**: 
- `query` (string) - Search term
- `filter` (number, optional) - Filter type
**Response**: User search results
**Access**: Authenticated

#### **GET** `/api/auth/users/friends`
**Purpose**: Get current user's friend accounts
**Response**: `IResponse<IFriendAccountDto>`
**Access**: Authenticated

#### **GET** `/api/company/settings`
**Purpose**: Get user settings
**Response**: Settings array
**Access**: Authenticated

### Notifications API

#### **GET** `/api/notifications/messages/subjects`
**Purpose**: Get message subjects
**Query Parameters**:
- `ObjectId` (number) - Object ID
- `Type` (CorrespondenceTypeEnum) - Message type
- `Query` (string, optional) - Search term
**Response**: Subject list with message counts
**Access**: Authenticated

#### **POST** `/api/notifications/messages`
**Purpose**: Send message
**Request Body**: `ISendMessageRequest`
**Response**: Message confirmation
**Access**: Authenticated

### File Management API

#### **POST** `/api/files/upload`
**Purpose**: Upload files
**Request**: Multipart form data
**Response**: File metadata
**Access**: Authenticated

#### **GET** `/api/files/:id`
**Purpose**: Download file
**Parameters**: `id` (string) - File ID
**Response**: File stream
**Access**: Authenticated

## Response Patterns

### Standard Response Wrapper
```typescript
interface IResponse<T> {
  items: T[];
  total: number;
  linkToModule: string;
  totalCount?: number;
  weekCount?: number;
}
```

### Error Response
```typescript
interface ErrorResponse {
  status: number;
  title: string;
  errors?: { [field: string]: string[] };
}
```

### Permission-Based Response
```typescript
interface PermissionResponse<T> {
  data: T;
  permissions: string[];
}
```

## Authentication and Security

### JWT Token
- **Header**: `Authorization: Bearer <token>`
- **Required**: All protected API endpoints
- **Expiration**: Handled by interceptors
- **Refresh**: Automatic logout on 401

### Permission Guards
- **Route Level**: Guards protect entire route trees
- **API Level**: Permissions returned with data
- **UI Level**: Conditional rendering based on permissions

### Error Handling
- **401 Unauthorized**: Automatic logout and redirect
- **403 Forbidden**: Redirect to permission denied page
- **404 Not Found**: Graceful error display
- **500 Server Error**: Generic error notification

## Request/Response Flow

### Standard Flow
1. **Client Request**: Component initiates API call
2. **JWT Interceptor**: Adds authentication header
3. **API Service**: Executes HTTP request
4. **Backend Processing**: Server processes request
5. **Response**: Returns data with standard wrapper
6. **Error Interceptor**: Handles any errors
7. **Component**: Processes response data

### Filter Flow
1. **UI Filter**: User applies filters
2. **Filter Builder**: Converts UI filters to API format
3. **API Request**: POST with filter object
4. **Filtered Response**: Returns matching data
5. **UI Update**: Display filtered results

### File Upload Flow
1. **File Selection**: User selects files
2. **Form Data**: Convert to multipart form
3. **Upload Request**: POST to file endpoint
4. **Progress Tracking**: Monitor upload progress
5. **File Metadata**: Receive file information
6. **UI Update**: Display uploaded files
