import { Component, EventEmitter, Input, Optional, Output, Self } from '@angular/core';
import { FormControl, FormGroup, NgControl } from '@angular/forms';
import { formatDate } from '@angular/common';
import { EMPTY_FUNCTION } from '@app/core/constants/empty';

@Component({
	selector: 'ss-date-range',
	templateUrl: './date-range.component.html',
	styleUrls: ['./date-range.component.scss'],
})
export class DateRangeComponent {
	@Input() public label: string | undefined;
	@Input() public placeholder: string | undefined;
	@Input() public error: string | undefined;
	@Output() public select = new EventEmitter<string>();

	@Input() public value: any = '';

	public formRange = new FormGroup({
		startDate: new FormControl<string | null>(null),
		endDate: new FormControl<string | null>(null),
	});

	private onChange = EMPTY_FUNCTION;
	private onTouched = EMPTY_FUNCTION;

	public constructor(@Self() @Optional() private readonly ngControl: NgControl) {
		if (this.ngControl) {
			this.ngControl.valueAccessor = this;
		}
	}

	public writeValue(value: any): void {
		this.value = value;

		if (!this.value) {
			this.formRange.setValue({ startDate: null, endDate: null });

			return;
		}

		const [startDate, endDate] = value.split('-');

		this.formRange.setValue({
			startDate: this.convertDateFormat(startDate),
			endDate: this.convertDateFormat(endDate),
		});
	}

	public registerOnChange(fn: Function): void {
		this.onChange = fn;
	}

	public registerOnTouched(fn: Function): void {
		this.onTouched = fn;
	}

	public clear(): void {
		this.formRange.reset();
		this.dateChanged();
	}

	public dateChanged(): void {
		if (!this.formRange.controls.startDate.value && !this.formRange.controls.endDate.value) {
			this.select.emit('');

			return;
		}

		if (!this.formRange.controls.startDate.value || !this.formRange.controls.endDate.value) {
			return;
		}

		const startDate = formatDate(
			this.formRange.controls.startDate.value,
			'dd.MM.yyyy',
			'ru-RU',
		);

		const endDate = formatDate(this.formRange.controls.endDate?.value, 'dd.MM.yyyy', 'ru-RU');

		this.select.emit(`${startDate}-${endDate}`);
	}

	private convertDateFormat(dateStr: string): string {
		const [day, month, year] = dateStr.split('.');

		return `${year}-${month}-${day}`;
	}
}
