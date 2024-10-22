import {
	Component,
	EventEmitter,
	forwardRef,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
	selector: 'ss-form-control-input-with-func-edit',
	templateUrl: './form-control-input-with-func-edit.component.html',
	styleUrls: ['./form-control-input-with-func-edit.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => FormControlInputWithFuncEditComponent),
			multi: true,
		},
	],
})
export class FormControlInputWithFuncEditComponent implements ControlValueAccessor, OnChanges {
	@Input() public size: 'large' | 'medium' | 'small' = 'medium';
	@Input() public disabled: boolean = false;
	@Input() public funcEdit: boolean = false;
	@Input() public label: string | undefined;
	@Input() public placeholder: string = '';
	@Input() public type: 'text' | 'email' | 'number' = 'text';
	@Input() public error: string | undefined;
	@Input() public maxlength: string = '256';
	@Input() public control: FormControl<string | null> = new FormControl<string | null>(null);
	@Output() public cancelEditing: EventEmitter<any> = new EventEmitter<any>();
	protected oldValue: string | null = null;

	private OnChange!: (value: string) => void;
	private OnTouched!: (value: string) => void;

	/**
	 * Write form value to the DOM element (model => view)
	 */
	public writeValue(value: string): void {
		this.control.setValue(value);
		this.OnChange(value);
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.funcEdit.currentValue) {
			this.oldValue = this.control.value;
		}
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
		this.OnChange = fn;
	}

	/**
	 * Update form when DOM element is blurred (view => model)
	 */
	public registerOnTouched(fn: any): void {
		// Store the provided function as an internal method.
		this.OnChange = fn;
	}

	close() {
		this.cancelEditing.emit();
	}

	clear() {
		this.control.setValue(null);
	}
}
