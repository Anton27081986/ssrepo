import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { searchType } from '@app/shared/components/inputs/search-input/search-input.component';

export interface IFilter {
	name: string;
	type: 'string' | 'number' | 'date-range' | 'search' | 'select' | 'boolean' | 'search-select';
	label: string;
	placeholder: string;
	value?: IFilterOption[] | string | null;
	options?: IFilterOption[];
	searchType?: searchType;
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

	@Input() public isDropdown: boolean = false;

	public filtersForm!: FormGroup;

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
	}

	public resetForm() {
		this.filters.forEach(filter => {
			this.removeFilter(filter.name);
		});
		this.changeDetector.detectChanges();
	}

	public toggleFilters() {
		this.isFiltersVisibleChange.emit(!this.isFiltersVisible);
	}

	public onFiltersApply() {
		this.filters = this.filters.reduce((selected: IFilter[], item) => {
			let value = this.filtersForm.value[item.name];

			if (this.filtersForm.value[item.name]) {
				if (item.type.includes('boolean')) {
					value = this.filtersForm.value ? 'Да' : 'Нет';
				}

				if (item.type === 'search') {
					item.options = [
						{
							id: this.filtersForm.value[item.name].id,
							name: this.filtersForm.value[item.name].name,
						},
					];
					value = item.options;
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
		this.changeDetector.detectChanges();
	}

	public removeFilter(name: string) {
		this.filtersForm.get(name)?.setValue(null);

		const filter = this.filters.find(item => item.name === name);

		if (filter) {
			filter.value = null;

			if (filter.type === 'select') {
				filter.options?.forEach(option => (option.checked = false));
			} else {
				filter.options = [];
			}
		}
	}

	protected readonly Event = Event;
	protected readonly Array = Array;
}
