import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

export interface IFilter {
	name: string;
	type: 'input' | 'date';
	label: string;
	value?: string;
}

@Component({
	selector: 'ss-filters',
	templateUrl: './filters.component.html',
	styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent implements OnInit {
	@Input() isFiltersVisible!: boolean;
	@Output() isFiltersVisibleChange = new EventEmitter<boolean>();

	@Input() filters: IFilter[] = [];

	@Output() getFilter: EventEmitter<{ [key: string]: string }> = new EventEmitter<{
		[key: string]: string;
	}>();

	public filtersForm!: FormGroup;
	public selectedFilters: IFilter[] = [];

	constructor(private readonly formBuilder: FormBuilder) {}

	ngOnInit() {
		this.filtersForm = this.formBuilder.group(
			this.filters.reduce((group, filter) => {
				return { ...group, [filter.name]: [] };
			}, {}),
		);

		this.selectedFilters = this.filters.filter(item => item.value);
	}

	resetForm() {
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

	removeFilter(name: string) {
		this.filtersForm.get(name)?.setValue('');

		this.selectedFilters = this.selectedFilters.filter(item => item.name !== name);
	}
}
