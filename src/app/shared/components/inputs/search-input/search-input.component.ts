import {
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	Optional,
	Output,
	Self,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { SearchFacadeService } from '@app/core/facades/search-facade.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';

type searchType = 'user' | 'subsector' | 'region' | 'contractor';

@UntilDestroy()
@Component({
	selector: 'ss-search-input',
	templateUrl: './search-input.component.html',
	styleUrls: ['./search-input.component.scss'],
})
export class SearchInputComponent implements ControlValueAccessor {
	@Input() public size: 'large' | 'medium' | 'small' = 'medium';
	@Input() public disabled: boolean = false;
	@Input() public label: string | undefined;
	@Input() public placeholder: string = 'Поиск';
	@Input() public error: string | undefined;
	@Input() public searchType: searchType = 'user';
	@Output() public select = new EventEmitter<any>();

	public value: any = '';
	public found: IDictionaryItemDto[] = [];

	public constructor(
		// Retrieve the dependency only from the local injector,
		// not from parent or ancestors.
		@Self()
		// We want to be able to use the component without a form,
		// so we mark the dependency as optional.
		@Optional()
		private readonly ngControl: NgControl,
		public readonly searchFacade: SearchFacadeService,
		private readonly ref: ChangeDetectorRef,
	) {
		if (this.ngControl) {
			this.ngControl.valueAccessor = this;
		}
	}

	/**
	 * Write form value to the DOM element (model => view)
	 */
	public writeValue(value: any): void {
		this.value = value;
	}

	/**
	 * Write form disabled state to the DOM element (model => view)
	 */
	public setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	/**
	 * Update form when DOM element value changes (view => model)
	 */
	public registerOnChange(fn: any): void {
		// Store the provided function as an internal method.
		this.onChange = fn;
	}

	/**
	 * Update form when DOM element is blurred (view => model)
	 */
	public registerOnTouched(fn: any): void {
		// Store the provided function as an internal method.
		this.onTouched = fn;
	}

	protected onChange(value: string) {}
	protected onTouched() {}

	protected onSearch(query: string) {
		switch (this.searchType) {
			case 'user':
				this.searchFacade
					.getUsers(query)
					.pipe(untilDestroyed(this))
					.subscribe(res => {
						this.found = res.items;
						this.ref.detectChanges();
					});
				break;
			case 'subsector':
				this.searchFacade
					.getSubSectors(query)
					.pipe(untilDestroyed(this))
					.subscribe(res => {
						this.found = res.items;
						this.ref.detectChanges();
					});
				break;
			case 'region':
				this.searchFacade
					.getRegions(query)
					.pipe(untilDestroyed(this))
					.subscribe(res => {
						this.found = res.items;
						this.ref.detectChanges();
					});
				break;
			case 'contractor':
				this.searchFacade
					.getContractor(query)
					.pipe(untilDestroyed(this))
					.subscribe(res => {
						this.found = res;
						this.ref.detectChanges();
					});
				break;
		}
	}
}
