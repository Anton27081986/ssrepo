import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

export interface IFilter {
	name: string;
	type: 'input' | 'date' | 'select' | 'boolean';
	label: string;
	placeholder: string;
	value?: string;
	options?: Array<{ id: number; name: string }>;
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

	@Output() public getFilter: EventEmitter<{ [key: string]: string }> = new EventEmitter<{
		[key: string]: string;
	}>();

	public filtersForm!: FormGroup;
	public selectedFilters: IFilter[] = [];

	constructor(private readonly formBuilder: FormBuilder) {}

	public ngOnInit() {
		this.filtersForm = this.formBuilder.group(
			this.filters.reduce((group, filter) => {
				return { ...group, [filter.name]: [] };
			}, {}),
		);

		this.selectedFilters = this.filters.filter(item => item.value);
	}

	public resetForm() {
		this.selectedFilters = [];

		for (const controlsKey in this.filtersForm.controls) {
			this.filtersForm.get(controlsKey)?.setValue('');
		}
	}

	public toggleFilters() {
		this.isFiltersVisibleChange.emit(!this.isFiltersVisible);
	}

	public onFiltersApply() {
		this.selectedFilters = this.filters.reduce((selected: IFilter[], item) => {
			const value =
				this.filtersForm.value[item.name] && item.type.includes('date')
					? new Date(this.filtersForm.value[item.name]).toLocaleString('ru-Ru', {
							year: 'numeric',
							month: 'numeric',
							day: 'numeric',
						})
					: this.filtersForm.value[item.name];

			return value ? [...selected, { ...item, value }] : selected;
		}, []);

		this.getFilter.emit(this.filtersForm.value);
	}

	public removeFilter(name: string) {
		this.filtersForm.get(name)?.setValue('');

		this.selectedFilters = this.selectedFilters.filter(item => item.name !== name);
	}
}
