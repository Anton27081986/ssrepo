import { Component, EventEmitter, Input, Optional, Output, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
	selector: 'ss-input',
	templateUrl: './input.component.html',
	styleUrls: ['./input.component.scss'],
})
export class InputComponent implements ControlValueAccessor {
	@Input() public size: 'large' | 'medium' | 'small' = 'medium';
	@Input() public disabled: boolean = false;
	@Input() public label: string | undefined;
	@Input() public placeholder: string = '';
	@Input() public type: 'text' | 'email' | 'number' = 'text';
	@Input() public error: string | undefined;
	@Input() public maxlength: string = '256';
	@Input() public value: any = '';

	@Output() clear: EventEmitter<any> = new EventEmitter();

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
		this.onChange(value);
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

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected onChange(value: string) {
		if (!value) {
			this.clear.emit();
		}
	}

	protected onTouched() {}
}
