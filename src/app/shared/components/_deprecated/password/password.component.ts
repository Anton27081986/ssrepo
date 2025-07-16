import { Component, Input, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { CaptionComponent } from '@app/shared/components/typography/caption/caption.component';
import { IconComponent } from '@app/shared/components/icon/icon.component';

@Component({
	selector: 'ss-password',
	templateUrl: './password.component.html',
	styleUrls: ['./password.component.scss'],
	imports: [CaptionComponent, IconComponent],
	standalone: true,
})
export class PasswordComponent implements ControlValueAccessor {
	@Input()
	public size: 'large' | 'medium' | 'small' = 'medium';

	@Input()
	public disabled = false;

	@Input()
	public label: string | undefined;

	@Input()
	public placeholder = '';

	@Input()
	public error: string | undefined;

	public type: 'text' | 'password' = 'password';
	public value: any = '';

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

	protected onChange(value: string) {
		console.warn(value);
	}

	protected onTouched() {}

	public onChangeVisibility() {
		this.type = this.type === 'text' ? 'password' : 'text';
	}
}
