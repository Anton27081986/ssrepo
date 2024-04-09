import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Input,
	OnInit,
} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, distinctUntilChanged, of, Subject } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@UntilDestroy()
@Component({
	selector: 'ss-autocomplete-select-field',
	templateUrl: './autocomplete-select-field.component.html',
	styleUrls: ['./autocomplete-select-field.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteSelectFieldComponent implements ControlValueAccessor, OnInit {
	@Input() public url: string | undefined;
	@Input() public label: string = '';
	@Input() public placeholder: string = '';
	@Input() public selectOptions: IDictionaryItemDto[] = [];
	@Input() public needSearch: boolean = true;
	@Input() public isDisabled: boolean = false;
	@Input() public isLoading: boolean = false;
	public selectedValue?: number;

	private readonly searchFieldChanged: Subject<string> = new Subject<string>();

	public constructor(
		private readonly httpClient: HttpClient,
		private readonly ngControl: NgControl,
		private readonly cdr: ChangeDetectorRef,
	) {
		if (this.ngControl !== null) {
			this.ngControl.valueAccessor = this;
		}
	}

	public ngOnInit(): void {
		this.setupSearch();
	}

	private setupSearch() {
		if (!this.url) {
			return;
		}

		const search$ = this.needSearch
			? this.searchFieldChanged.pipe(
					debounceTime(300),
				//	distinctUntilChanged(),
					switchMap(term => this.requestToServer(term)),
				)
			: this.requestToServer('');

		search$
			.pipe(
				catchError((err: unknown) => {
					console.error(err);

					return of([]);
				}),
				untilDestroyed(this),
			)
			.subscribe(options => {
				this.selectOptions = options;
				this.cdr.detectChanges();
			});
	}

	private requestToServer(searchTerm: string = '') {
		if (searchTerm) {
			return this.httpClient.get<IDictionaryItemDto[]>(this.url!, {
				params: new HttpParams().set('query', searchTerm),
			});
		}

		return this.httpClient.get<IDictionaryItemDto[]>(this.url!);
	}

	public search(searchTerm: string) {
		if (this.needSearch && searchTerm.length > 0) {
			this.searchFieldChanged.next(searchTerm);
		}
	}

	public writeValue(value: any): void {
		this.selectedValue = undefined;
		this.selectedValue = value;
		this.cdr.detectChanges();
	}

	public registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	public registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	protected onChange(value: string) {}

	protected onTouched() {}

	public onValueChange(value: any) {
		if (value === null || value === undefined) {
			this.selectedValue = value;
		}

		if (this.ngControl.control) {
			this.ngControl.control.setValue(this.selectedValue);
		}
	}
}
