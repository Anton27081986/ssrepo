import { Component, EventEmitter, Input, Optional, Output, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Component({
	selector: 'ss-date-range',
	templateUrl: './date-range.component.html',
	styleUrls: ['./date-range.component.scss'],
})
export class DateRangeComponent {
	startDate: string | undefined;
	endDate: string | undefined;
	@Input() public label: string | undefined;
	@Input() public placeholder: string | undefined;
	@Input() public error: string | undefined;
	@Output() public select = new EventEmitter<any>();

	@Input() public value: any = '';
	public constructor(
		// Retrieve the dependency only from the local injector,
		// not from parent or ancestors.
		@Self()
		// We want to be able to use the component without a form,
		// so we mark the dependency as optional.
		@Optional()
		private readonly ngControl: NgControl,
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
		if (!this.value) {
			this.startDate = undefined;
			this.endDate = undefined;
		} else {
			[this.startDate, this.endDate] = value.split('-');
		}
	}

	/**
	 * Write form disabled state to the DOM element (model => view)
	 */
	public setDisabledState(isDisabled: boolean): void {
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

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected onChange(value: string) {}
	protected onTouched() {}

	dateChanged(start: string, end: string) {
		this.startDate = start;
		this.endDate = end;
		this.select.emit(`${start}-${end}`);
	}
}
