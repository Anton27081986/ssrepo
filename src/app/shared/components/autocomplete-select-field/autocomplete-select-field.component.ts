import {
	ChangeDetectionStrategy,
	Component,
	forwardRef,
	Input,
	OnInit,
	Optional,
	Self,
} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, distinctUntilChanged, filter, of, Subject } from 'rxjs';
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
	@Input() public selectOptions: IDictionaryItemDto[] | undefined;
	@Input() public needSearch: boolean = true;

	public value: any = '';

	private readonly searchFieldChanged: Subject<string> = new Subject<string>();

	public constructor(
		private readonly httpClient: HttpClient,
		@Self()
		@Optional()
		private readonly ngControl: NgControl,
	) {
		if (this.ngControl) {
			this.ngControl.valueAccessor = this;
		}
	}

	public ngOnInit(): void {
		if (this.url && !this.needSearch) {
			this.requestToServer(this.url)
				.pipe(untilDestroyed(this))
				.subscribe(options => {
					this.selectOptions = options;
				});
		}

		if (this.url && this.needSearch) {
			this.searchFieldChanged
				.pipe(
					filter(term => term.length > 1),
					debounceTime(300),
					distinctUntilChanged(),
					switchMap(term => this.requestToServerWithParams(this.url!, term)),
					catchError((err: unknown) => {
						console.error(err);

						return of([]);
					}),
					untilDestroyed(this),
				)
				.subscribe({
					next: options => {
						this.selectOptions = options;
					},
				});
		}
	}

	public requestToServer(url: string) {
		return this.httpClient.get<IDictionaryItemDto[]>(url);
	}

	public requestToServerWithParams(url: string, searchTerm: string) {
		return this.httpClient.get<IDictionaryItemDto[]>(url, {
			params: new HttpParams().set('query', searchTerm),
		});
	}

	public search(searchTerm: string) {
		if (this.needSearch) {
			this.searchFieldChanged.next(searchTerm);
		}
	}

	public registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	public registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	public writeValue(value: any): void {
		this.value = value;
	}

	protected onChange(value: string) {}

	protected onTouched() {}
}
