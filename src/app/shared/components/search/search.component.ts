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
	@Input() size: 'large' | 'medium' | 'small' = 'medium';
	@Input() closeIcon: boolean = false;
	@Input() searchIcon: boolean = false;
	@Input() placeholder: string = 'Поиск';
	@Input() adminEnter: boolean = false;

	private readonly destroy$ = new Subject<void>();
	public searchForm!: FormGroup;
	public searchedUsers: IUserProfile[] = [];
	public showWindowResult: boolean = false;

	constructor(
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
		this.showWindowResult = true;
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
