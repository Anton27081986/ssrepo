# Code Examples

## Data Models

### Interface Definition
```typescript
export interface IClientDto {
  id?: number;
  code?: number;
  name?: string | null;
  category?: IDictionaryItemDto;
  status?: IDictionaryItemDto;
}
```

### Response Wrapper
```typescript
export interface IResponse<T> {
  items: T[];
  total: number;
  linkToModule: string;
}
```

## API Services

### Basic API Service
```typescript
@Injectable({ providedIn: 'root' })
export class ClientApiService {
  constructor(private readonly http: HttpClient) {}

  public getClients(filter: IClientsFilter) {
    return this.http.post<IResponse<IClientItemDto>>(
      `${environment.apiUrl}/api/company/clients`,
      filter
    );
  }

  public getClientCardById(id: number): Observable<IClientDataDto> {
    return this.http.get<IClientDataDto>(
      `${environment.apiUrl}/api/company/clients/${id}`
    );
  }
}
```

## Business Logic (Facades)

### Facade Service Pattern
```typescript
@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class MpReservationOrderCardFacadeService {
  public isLoader$ = new BehaviorSubject<boolean>(false);
  
  private readonly activeOrder = new BehaviorSubject<IMpReservationOrder | null>(null);
  public activeOrder$ = this.activeOrder.asObservable();

  constructor(
    private readonly mpReservationOrdersApiService: MpReservationOrdersApiService,
    protected readonly router: Router
  ) {}

  public getPersonificationById(id: string): void {
    this.mpReservationOrdersApiService
      .getPersonificationById(id)
      .pipe(
        untilDestroyed(this),
        catchError((err: unknown) => {
          this.router.navigate(['mp-reservation-orders']);
          throw err;
        })
      )
      .subscribe((res) => {
        this.activeOrder.next(res.data);
      });
  }
}
```

## State Management

### State Service
```typescript
@Injectable({ providedIn: 'root' })
export class MainMenuStoreService {
  private readonly mainMenuSubject = new BehaviorSubject<IMenuItemDto[] | null>(null);

  public getMainMenu(): Observable<IMenuItemDto[] | null> {
    return this.mainMenuSubject.asObservable();
  }

  public setMainMenu(newMainMenu: IMenuItemDto[]) {
    this.mainMenuSubject.next(newMainMenu);
  }

  public addFavoriteMenu(newItem: IMenuItemDto) {
    const currentMenu = this.mainMenuSubject.getValue();
    const favoriteMenuItems = currentMenu![0].items;
    favoriteMenuItems?.push(newItem);
    this.mainMenuSubject.next(currentMenu);
  }
}
```

## Components

### Standalone Component
```typescript
@UntilDestroy()
@Component({
  selector: 'app-mp-reservation-order-card',
  templateUrl: './mp-reservation-order-card.component.html',
  styleUrls: ['./mp-reservation-order-card.component.scss'],
  imports: [
    TextComponent,
    ButtonComponent,
    TableComponent,
    DatePipe,
    NumWithSpacesPipe,
    NgIf,
  ],
  standalone: true,
})
export class MpReservationOrderCardComponent implements OnInit {
  public permissionService = inject(PermissionsFacadeService);
  
  public order: Signal<IMpReservationOrder | null> = toSignal(
    this.mpReservationOrderCardFacadeService.activeOrder$,
    { initialValue: null }
  );

  public volumes: WritableSignal<ITableItem[]> = signal([]);

  constructor(
    private readonly mpReservationOrderCardFacadeService: MpReservationOrderCardFacadeService
  ) {}
}
```

### Shared Component
```typescript
@Component({
  selector: 'ss-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  imports: [CommonModule, TooltipDirective, IconComponent, NumWithSpacesPipe],
  standalone: true,
})
export class TableComponent implements AfterViewInit {
  @Input() public head: ITableHead[] = [];
  @Input() public items: ITableItem[] | undefined | null;
  @Input() public padding = '12px';
  @Output() public controlClick = new EventEmitter<{row: ITableItem, icon: string}>();

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly modalService: ModalService
  ) {}

  onControlClick(row: ITableItem, icon: string) {
    this.controlClick.emit({ row, icon });
  }
}
```

## Services

### Authentication Service
```typescript
@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private readonly userSubject = new BehaviorSubject<IUser>(
    JSON.parse(localStorage.getItem('user')!)
  );
  public user$ = this.userSubject.asObservable();

  constructor(
    private readonly router: Router,
    private readonly http: HttpClient
  ) {}

  public get userValue(): IUser {
    return this.userSubject.value;
  }

  public login(username: string, password: string) {
    return this.http
      .post<any>(`${environment.apiUrl}/api/auth/login`, { username, password })
      .pipe(
        map((user) => {
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);
          return user;
        })
      );
  }
}
```

## Guards

### Route Guard
```typescript
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly authenticationService: AuthenticationService
  ) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = this.authenticationService.userValue;

    if (user) {
      const { roles } = route.data;
      if (roles && !roles.includes(user.role)) {
        this.router.navigate(['/']);
        return false;
      }
      return true;
    }

    this.router.navigate(['/auth/sign-in'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
}
```

## Interceptors

### JWT Interceptor
```typescript
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private readonly authenticationService: AuthenticationService) {}

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const user = this.authenticationService.userValue;
    const isLoggedIn = user?.token;
    const isApiUrl = request.url.startsWith(environment.apiUrl);

    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${user.token}`,
        },
      });
    }

    return next.handle(request);
  }
}
```

## Pipes

### Data Transformation Pipe
```typescript
@Pipe({
  name: 'numWithSpaces',
  standalone: true,
})
export class NumWithSpacesPipe implements PipeTransform {
  transform(value: unknown, digits = 2, sep = '\u00A0'): string {
    if (typeof value === 'number') {
      return this.numberWithSpaces(value, digits, sep);
    }
    if (typeof value === 'string') {
      return value;
    }
    return '';
  }

  numberWithSpaces(num: number, digits = 2, sep = '\u00A0'): string {
    const number = num % 1 > 0 ? num.toFixed(digits) : num;
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep);
  }
}
```

## Modal Service

### Dynamic Component Creation
```typescript
@Injectable({ providedIn: 'root' })
export class ModalService {
  constructor(
    private readonly overlay: Overlay,
    private readonly injector: Injector
  ) {}

  open<T>(component: ComponentType<T>, config?: DialogConfig) {
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    const overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'overlay-backdrop',
    });

    const dialogRef = new ModalRef(overlayRef);
    const injector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: ModalRef, useValue: dialogRef },
        { provide: DIALOG_DATA, useValue: config?.data },
      ],
    });

    const portal = new ComponentPortal(component, null, injector);
    overlayRef.attach(portal);
    return dialogRef;
  }
}
```

## Reactive Patterns

### Observable Data Flow
```typescript
// In component
ngOnInit() {
  this.facade.activeOrder$
    .pipe(untilDestroyed(this))
    .subscribe(order => {
      this.processOrder(order);
    });
}

// With signals
public order = toSignal(this.facade.activeOrder$, { initialValue: null });
public isLoading = signal(false);
```

### Error Handling
```typescript
this.apiService.getData()
  .pipe(
    untilDestroyed(this),
    catchError((error) => {
      this.handleError(error);
      return of(null);
    })
  )
  .subscribe(data => {
    this.processData(data);
  });
```

## Dependency Injection

### Modern Inject Function
```typescript
@Component({...})
export class MyComponent {
  private service = inject(MyService);
  private router = inject(Router);
}
```

### Constructor Injection
```typescript
@Component({...})
export class MyComponent {
  constructor(
    private readonly service: MyService,
    private readonly router: Router
  ) {}
}
```
