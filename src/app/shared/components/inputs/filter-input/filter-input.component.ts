import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	Optional,
	Output,
	Self,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import {CaptionComponent} from "@app/shared/components/typography/caption/caption.component";
import {IconComponent} from "@app/shared/components/icon/icon.component";
import {NgIf} from "@angular/common";

@Component({
	selector: 'ss-filter-input',
	templateUrl: './filter-input.component.html',
	styleUrls: ['./filter-input.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CaptionComponent,
		IconComponent,
		NgIf
	],
	standalone: true
})
export class FilterInputComponent {
	@Input() public size: 'large' | 'medium' | 'small' = 'medium';
	@Input() public disabled: boolean = false;
	@Input() public label: string | undefined;
	@Input() public error: string | undefined;
	@Output() protected search = new EventEmitter();

	public value: any = '';

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
