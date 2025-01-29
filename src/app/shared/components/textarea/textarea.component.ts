import { ChangeDetectionStrategy, Component, Input, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Component({
	selector: 'ss-textarea',
	templateUrl: './textarea.component.html',
	styleUrls: ['./textarea.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaComponent {
	@Input() public size: 'large' | 'medium' = 'medium';
	@Input() public disabled: boolean = false;
	@Input() public label: string | undefined;
	@Input() public cols: string | undefined;
	@Input() public rows: string | undefined;
	@Input() public placeholder: string = '';
	@Input() public error: string | undefined;
	@Input() public maxLength: number | undefined;

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
	protected onChange(value: string) {}
	protected onTouched() {}
}
