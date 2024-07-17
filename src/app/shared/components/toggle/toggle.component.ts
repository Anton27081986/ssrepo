import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
	selector: 'ss-toggle',
	templateUrl: './toggle.component.html',
	styleUrls: ['./toggle.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => ToggleComponent),
			multi: true,
		},
	],
})
export class ToggleComponent implements ControlValueAccessor {
	@Input()
	public disabled: boolean;

	@Input() public label: string | undefined;

	@Input()
	public set value(isChecked: boolean) {
		if (!this.disabled) {
			this.isChecked = isChecked;
			this.onChange(isChecked);
		}
	}

	protected isChecked: boolean | undefined;

	constructor() {
		this.disabled = false;
	}

	public onChange: any = () => {};
	public onTouch: any = () => {};

	public writeValue(value: any): void {
		this.value = value;
	}

	public registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	public registerOnTouched(fn: any): void {
		this.onTouch = fn;
	}

	public setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	public toggleChecked(): void {
		if (!this.disabled) {
			this.isChecked = !this.isChecked;
			this.onChange(this.isChecked);
		}
	}
}
