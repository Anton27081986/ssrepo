import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	HostListener,
	Input,
	OnDestroy,
	OnInit,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersApiService } from '@app/core/api/users-api.service';
import { IUserProfile } from '@app/core/models/user-profile';

@Component({
	selector: 'ss-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit, OnDestroy {
	@Input() public size: 'large' | 'medium' | 'small' = 'medium';
	@Input() public closeIcon: boolean = false;
	@Input() public searchIcon: boolean = false;
	@Input() public placeholder: string = 'Поиск';
	@Input() public adminEnter: boolean = false;

	private readonly destroy$ = new Subject<void>();
	public searchForm!: FormGroup;
	public searchedUsers: IUserProfile[] = [];
	public showWindowResult: boolean = false;

	public constructor(
		private readonly formBuilder: FormBuilder,
		private readonly usersApiService: UsersApiService,
		private readonly ref: ChangeDetectorRef,
		private readonly elem: ElementRef,
	) {}

	public ngOnInit() {
		this.searchForm = this.formBuilder.group({
			search: ['', Validators.minLength(2)],
		});
	}

	@HostListener('document:click', ['$event'])
	public onClick(event: Event) {
		if (!this.elem.nativeElement.contains(event.target)) {
			this.showWindowResult = false;
		}
	}

	public loadSearchUsers() {
		const searchTerm = this.searchForm.get('search')?.value;

		if (!searchTerm) {
			this.searchedUsers = [];

			return;
		}

		this.usersApiService
			.getUsersByFIO(searchTerm)
			.pipe(takeUntil(this.destroy$))
			.subscribe(response => {
				this.searchedUsers = response.items;

				if (this.searchedUsers.length > 0) {
					this.showWindowResult = true;
				}

				this.ref.detectChanges();
			});
	}

	public clearSearch() {
		this.showWindowResult = false;
		this.searchForm.get('search')?.setValue('');
	}

	public ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
