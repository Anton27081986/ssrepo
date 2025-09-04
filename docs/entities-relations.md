# Entities and Relations

## Core Business Entities

### User and Authentication

#### User Entity
**Purpose**: Represents system users with authentication and profile information.
**Key Properties**: `id`, `name`, `email`, `department`, `position`, `isAdmin`, `avatarUrl`
**Business Role**: Central identity for all operations, authentication, and authorization.

#### Friend Account
**Purpose**: Simplified user representation for relationships and references.
**Key Properties**: `id`, `name`, `avatarUrl`, `department`
**Relations**: Referenced by User entity for relationships and logged user context.

### Company Domain

#### Client Entity
**Purpose**: Core business entity representing customers and potential customers.
**Key Properties**: `id`, `code`, `name`, `category`, `status`, `region`, `saleDirection`
**Business Role**: Central hub for sales, proposals, and business relationships.

**Relations**:
- **Has Many** Managers (many-to-many relationship)
- **Has Many** Contractors (business partners)
- **Has Many** Client Proposals
- **Belongs To** Category, Status, Region (dictionary items)
- **Has Many** Sale Requests, Return Requests, New Products

#### Manager Entity
**Purpose**: Represents users responsible for client relationships.
**Key Properties**: `id`, `name`, `firstName`, `lastName`, `department`, `position`
**Relations**:
- **Manages Many** Clients
- **Extends** User entity with management-specific properties

#### Contractor Entity
**Purpose**: Represents business partners and suppliers.
**Key Properties**: `id`, `name`, `status`, `creditStatus`
**Relations**:
- **Associated With** Clients
- **Has** Credit Status and Contractor Status

### Production and Planning

#### MP Reservation Order
**Purpose**: Material planning reservation orders for production scheduling.
**Key Properties**: `id`, `code`, `status`, `totalAmount`, `contractor`, `manager`, `dateFrom`, `dateTo`
**Business Role**: Critical for material planning and production coordination.

**Relations**:
- **Belongs To** Contractor
- **Belongs To** Manager
- **Has** Provision details
- **Contains Many** Order Requests
- **References** TOV (goods) dictionary

#### Operation Plan
**Purpose**: Detailed production planning and scheduling.
**Key Properties**: `id`, `weekId`, `tov`, `productionSection`, `planQuantity`, `factQuantity`
**Relations**:
- **Belongs To** TOV (goods)
- **Has** Production Section, Production Type, Production City
- **Managed By** Product Manager User, Plan Economic User
- **Contains** Plan Days with daily scheduling

#### Completed Work Acts
**Purpose**: Documents completed work and financial transactions.
**Key Properties**: `id`, `externalActNumber`, `totalAmount`, `state`, `payerContractor`, `providerContractor`
**Relations**:
- **Associated With** Payer Contractor
- **Associated With** Provider Contractor
- **Has** Applicant User
- **Contains** Financial Documents
- **References** Currency dictionary

### Sales and Proposals

#### Client Proposals/Offers
**Purpose**: Commercial proposals and offers to clients.
**Key Properties**: `prices`, `advantages`, `files`, `clientId`
**Relations**:
- **Belongs To** Client
- **Contains** Price information
- **Has** Advantages list
- **Attached** Files

#### Business Trips
**Purpose**: Travel and business trip management related to client activities.
**Relations**:
- **Associated With** Clients
- **Linked To** Proposals

#### Development Projects
**Purpose**: Product development initiatives.
**Relations**:
- **Connected To** Client Proposals
- **Part Of** Business planning

### Supporting Entities

#### Dictionary Items
**Purpose**: System-wide reference data and classifications.
**Types**: Categories, Statuses, Regions, Currencies, TOV (goods)
**Usage**: Referenced by all major entities for standardized classifications.

#### Files
**Purpose**: Document and file management across the system.
**Relations**: Attached to Proposals, Work Acts, and other entities requiring documentation.

#### Notifications
**Purpose**: System notifications and alerts.
**Relations**: Delivered to Users based on their activities and permissions.

## Entity Relationship Patterns

### Master-Detail Relationships

#### Client as Master Entity
- Client → Managers (assignment relationship)
- Client → Contractors (business partnership)
- Client → Proposals (commercial relationship)
- Client → Sale/Return/Sample Requests (transactional relationship)

#### Order Processing Flow
- MP Reservation Order → Order Requests → Provision Details
- Operation Plan → Plan Days → Manufacturing Orders

### Reference Data Pattern
All major entities reference Dictionary Items for:
- **Status tracking** (Active, Inactive, Pending states)
- **Categorization** (Client categories, TOV types)
- **Geographic data** (Regions, cities)
- **Financial data** (Currencies, units)

### User Context Pattern
Most business entities maintain user relationships:
- **Created By** (author/creator)
- **Managed By** (responsible user)
- **Assigned To** (current owner)

## Data Access Patterns

### Filtered Access
Entities support filtering through dedicated filter objects:
- `IClientsFilter` for client searches
- `IBusinessTripsFilter` for trip management
- Permission-based data filtering

### Hierarchical Access
- Users → Departments → Clients → Proposals
- Production Plans → Operation Plans → Daily Plans
- Client Categories → Sub-sectors

### Audit and Tracking
Most entities include:
- Creation timestamps (`dateCreated`)
- Modification tracking
- User attribution for changes
- Status history

## Usage Guidelines

### Entity Creation
1. **Always** validate required dictionary references
2. **Ensure** proper user context assignment
3. **Initialize** with appropriate default status
4. **Maintain** referential integrity

### Relationship Management
1. **Use** facade services for complex entity operations
2. **Implement** proper cascade rules for deletions
3. **Maintain** bi-directional relationships where needed
4. **Cache** frequently accessed dictionary data

### State Management
1. **Track** entity states through status fields
2. **Implement** state transition validation
3. **Log** state changes for audit purposes
4. **Use** permissions to control state transitions

### Data Consistency
1. **Validate** cross-entity business rules
2. **Implement** transaction boundaries for related updates
3. **Handle** concurrent access through optimistic locking
4. **Maintain** data integrity through foreign key constraints

## Business Rules

### Client Management
- Clients must have at least one assigned manager
- Client status changes require proper permissions
- Regional assignments affect available managers

### Production Planning
- MP Reservation Orders require contractor and manager assignment
- Operation Plans must align with reservation orders
- Production capacity constraints must be validated

### Financial Processes
- Completed Work Acts require both payer and provider contractors
- Currency must be specified for all financial transactions
- Document attachments are mandatory for certain act types

### Security and Permissions
- User permissions determine entity access levels
- Department-based data segregation
- Role-based operation restrictions
