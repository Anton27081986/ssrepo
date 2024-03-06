import { Component, Input, OnInit, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
	selector: 'ss-input',
	templateUrl: './input.component.html',
	styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit, ControlValueAccessor {
	@Input() size: 'large' | 'medium' = 'medium';
	@Input() disabled: boolean = false;
	@Input() label: string | undefined;
	@Input() placeholder: string = '';
	@Input() type: 'text' | 'email' = 'text';
	@Input() error: string | undefined;

	value: any = '';

	constructor(
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

	ngOnInit() {}

	/**
	 * Write form value to the DOM element (model => view)
	 */
	writeValue(value: any): void {
		this.value = value;
	}

	/**
	 * Write form disabled state to the DOM element (model => view)
	 */
	setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	/**
	 * Update form when DOM element value changes (view => model)
	 */
	registerOnChange(fn: any): void {
		// Store the provided function as an internal method.
		this.onChange = fn;
	}

	/**
	 * Update form when DOM element is blurred (view => model)
	 */
	registerOnTouched(fn: any): void {
		// Store the provided function as an internal method.
		this.onTouched = fn;
	}

	protected onChange(value: string) {}
	protected onTouched() {}
}
