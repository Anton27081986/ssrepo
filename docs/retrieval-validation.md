# Data Retrieval and Validation

## Data Retrieval Patterns

### API Service Layer

#### Standard HTTP Operations
Data retrieval follows RESTful patterns through dedicated API services in `core/api/`:

**GET Operations**:
- **Single Entity**: `getClientCardById(id: number): Observable<IClientDataDto>`
- **Collection**: `getClients(filter: IClientsFilter): Observable<IResponse<IClientItemDto>>`
- **Related Data**: `getManagers(id: number): Observable<IManagerItemDto[]>`

**POST Operations for Complex Queries**:
- **Filtered Search**: POST with filter objects for complex queries
- **Data Creation**: POST with request DTOs

**PUT/DELETE Operations**:
- **Updates**: PUT with partial data and ID
- **Deletions**: DELETE with entity ID

#### Response Standardization
All API responses use standardized wrapper interfaces:

**IResponse<T> Structure**:
- `items: T[]` - Array of data entities
- `total: number` - Total count for pagination
- `linkToModule: string` - Navigation context
- Additional metadata for specific operations

#### Query Parameter Handling
Dynamic query building uses `HttpParams`:
- **Search Terms**: `params.set('query', searchTerm)`
- **Filters**: `params.set('isActiveOnly', boolean)`
- **Pagination**: Limit/offset parameters

### Facade Layer Processing

#### Data Orchestration
Facades handle complex data operations:
- **Multi-API Coordination**: Combining multiple API calls
- **State Management**: BehaviorSubject for reactive data flow
- **Error Handling**: Centralized error processing with navigation

#### Data Transformation Pipeline
```typescript
this.apiService.getData()
  .pipe(
    untilDestroyed(this),
    catchError((err) => {
      this.handleError(err);
      throw err;
    })
  )
  .subscribe((res) => {
    this.processData(res.data);
    this.updateState(res);
  });
```

## Error Handling and Validation

### HTTP Error Interceptor

#### Error Classification
Centralized error handling through `ErrorInterceptor`:

**4xx Client Errors**:
- **401 Unauthorized**: Auto-logout and redirect to login
- **405 Method Not Allowed**: Redirect to password reset
- **Validation Errors**: Field-specific error messages

**5xx Server Errors**:
- **Generic Server Error**: Standard error notification
- **Fallback Handling**: Default error messages

#### Error Response Processing
- **Field Validation**: Extract `err.error.errors` for form validation
- **User Notifications**: Display errors via toast notifications
- **Navigation**: Redirect on authentication failures

### Form Validation

#### Custom Validators
Business-specific validation in `core/validators/`:

**Date Validation**:
```typescript
export function dateFromLessDateTo(dateFrom: string, dateTo: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const dateFromCtrl = control.get(dateFrom);
    const dateToCtrl = control.get(dateTo);
    
    if (new Date(dateFromCtrl.value) < new Date(dateToCtrl.value)) {
      return null;
    }
    return { dateFromLessDateTo: true };
  };
}
```

#### Validation Patterns
- **Cross-Field Validation**: Compare related form fields
- **Business Rules**: Domain-specific validation logic
- **Real-time Validation**: Reactive validation on value changes

## Data Transformation

### Filter Processing

#### Filter Builder Utility
Complex filter transformation in `FilterBuilder` class:

**Filter Types**:
- **Numeric Filters**: Convert strings to numbers with null handling
- **Search Select**: Extract ID from object arrays
- **Date Range**: Split date ranges and format for API
- **Multi-Select**: Map arrays to ID collections

**Processing Pipeline**:
1. **Input Validation**: Check filter existence and type
2. **Type Conversion**: Transform UI values to API format
3. **Date Formatting**: Convert date strings to API format
4. **Object Mapping**: Extract relevant properties

### Data Formatting

#### Pipe Transformations
Standardized data transformation through pipes:

**Number Formatting**:
- **NumWithSpacesPipe**: Add space separators to numbers
- **Digit Precision**: Configurable decimal places
- **Null Handling**: Default values for empty data

**Date Formatting**:
- **ISO to Display**: Convert API dates to user-friendly format
- **Timezone Handling**: Account for timezone offsets
- **Empty Date Handling**: Default display for null dates

**Generic Mapping**:
- **MapperPipe**: Apply arbitrary transformation functions
- **Type Safety**: Maintain TypeScript type safety
- **Reusable Logic**: Common transformation patterns

### Component-Level Processing

#### Data Preparation for UI
Components transform API data for display:

**Table Data Transformation**:
```typescript
this.volumes.set(
  this.order()!.orderRequests?.map((item) => {
    return {
      amount: this.pipeNumWithSpaces.numberWithSpaces(item.amount, 2),
      requestedProvisionDate: item.requestedProvisionDate
        .split('T')[0]
        .split('-')
        .reverse()
        .join('.'),
    } as ITableItem;
  })
);
```

#### Signal-Based Reactivity
Modern Angular signals for reactive data:
- **Computed Values**: Derived data from signals
- **Automatic Updates**: UI updates on data changes
- **Performance**: Optimized change detection

## Data Flow Architecture

### Retrieval Flow
1. **Component Request**: Initiate data request
2. **Facade Orchestration**: Coordinate multiple operations
3. **API Service**: Execute HTTP request
4. **Interceptor Processing**: Handle authentication and errors
5. **Response Transformation**: Convert to application format
6. **State Update**: Update reactive state
7. **UI Rendering**: Display transformed data

### Validation Flow
1. **Input Validation**: Client-side form validation
2. **Business Rules**: Domain-specific validation
3. **API Submission**: Send validated data
4. **Server Validation**: Backend validation
5. **Error Handling**: Process validation errors
6. **User Feedback**: Display validation results

### Error Recovery
1. **Error Detection**: Identify error type and source
2. **Error Classification**: Categorize by severity and type
3. **Recovery Strategy**: Implement appropriate recovery
4. **User Notification**: Inform user of error and resolution
5. **State Restoration**: Restore application to valid state

## Best Practices

### Data Retrieval
- **Use TypeScript interfaces** for all API responses
- **Implement proper error handling** at service level
- **Cache frequently accessed data** in state services
- **Use reactive patterns** with observables and signals

### Validation
- **Validate at multiple layers**: Client, business logic, and server
- **Provide clear error messages** to users
- **Implement business rule validation** in custom validators
- **Use reactive forms** for complex validation scenarios

### Transformation
- **Standardize date and number formats** across the application
- **Use pipes for reusable transformations**
- **Implement null-safe operations** in all transformations
- **Maintain type safety** throughout transformation pipeline

### Performance
- **Use OnPush change detection** for components
- **Implement proper unsubscription** with untilDestroyed
- **Cache transformed data** when appropriate
- **Optimize filter operations** for large datasets

### Error Handling
- **Centralize error handling** through interceptors
- **Provide user-friendly error messages**
- **Implement graceful degradation** for non-critical errors
- **Log errors appropriately** for debugging and monitoring
