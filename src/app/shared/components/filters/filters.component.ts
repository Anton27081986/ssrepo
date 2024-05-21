import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { SearchType } from '@app/shared/components/multiselect/multiselect.component';

export interface IFilter {
	name: string;
	type: 'string' | 'number' | 'date' | 'select' | 'boolean' | 'search-select';
	label: string;
	placeholder: string;
	value?: IFilterOption[] | string | null;
	options?: IFilterOption[];
	searchType?: SearchType;
}

export interface IFilterOption extends IDictionaryItemDto {
	checked?: boolean;
}

@Component({
	selector: 'ss-filters',
	templateUrl: './filters.component.html',
	styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent implements OnInit {
	@Input() public isFiltersVisible!: boolean;
	@Output() public isFiltersVisibleChange = new EventEmitter<boolean>();

	@Input() public filters: IFilter[] = [];
	@Output() public filtersChange = new EventEmitter<IFilter[]>();

	@Output() public applyFilter = new EventEmitter();

	public filtersForm!: FormGroup;
	public selectedFilters: IFilter[] = [];

	constructor(
		private readonly changeDetector: ChangeDetectorRef,
		private readonly formBuilder: FormBuilder,
	) {}

	public ngOnInit() {
		this.filtersForm = this.formBuilder.group(
			this.filters.reduce((group, filter) => {
				return { ...group, [filter.name]: [filter.value] };
			}, {}),
		);

		this.selectedFilters = this.filters.filter(item => item.value);
	}

	public resetForm() {
		this.selectedFilters.forEach(filter => {
			this.removeFilter(filter.name);
		});
	}

	public toggleFilters() {
		this.isFiltersVisibleChange.emit(!this.isFiltersVisible);
	}

	public onFiltersApply() {
		this.filters = this.filters.reduce((selected: IFilter[], item) => {
			let value = this.filtersForm.value[item.name];

			if (this.filtersForm.value[item.name]) {
				if (item.type.includes('date')) {
					value = new Date(this.filtersForm.value[item.name]).toLocaleString('ru-Ru', {
						year: 'numeric',
						month: 'numeric',
						day: 'numeric',
					});
				}

				if (item.type.includes('boolean')) {
					value = this.filtersForm.value ? 'Да' : 'Нет';
				}
			}

			if (item.type === 'search-select') {
				item.options = Array.isArray(this.filtersForm.value[item.name])
					? this.filtersForm.value[item.name]
					: null;
			}

			return [
				...selected,
				{
					...item,
					value: value?.length ? value : null,
				},
			];
		}, []);

		this.filtersChange.emit(this.filters);
		this.applyFilter.emit();
		this.selectedFilters = this.filters.filter(item => item.value);
		this.changeDetector.detectChanges();
	}

	public removeFilter(name: string) {
		this.filtersForm.get(name)?.setValue(null);

		this.selectedFilters = this.selectedFilters.filter(item => item.name !== name);

		const filter = this.filters.find(item => item.name === name);

		if (filter) {
			filter.value = null;
			filter.options?.forEach(option => (option.checked = false));
		}
	}

	public getValuesFromDictionaryItems(items: IDictionaryItemDto[] | string) {
		return (items as unknown as IDictionaryItemDto[]).map(item => item.name).join(', ');
	}

	protected readonly Array = Array;
}
