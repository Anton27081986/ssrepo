import {
	ChangeDetectionStrategy,
	Component,
	Input,
	ViewChild,
	ElementRef,
	OnInit,
	forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
	selector: 'ss-numeric-input',
	templateUrl: './numeric-input.component.html',
	styleUrls: ['./numeric-input.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => NumericInputComponent),
			multi: true,
		},
	],
})
export class NumericInputComponent implements ControlValueAccessor, OnInit {
	@Input() public size: 'large' | 'medium' = 'medium';
	@Input() public disabled: boolean = false;
	@Input() public label: string | undefined;
	@Input() public placeholder: string = '';
	@Input() public error: string | undefined;
	@Input() public value: any = '';

	@ViewChild('input', { static: true }) public input!: ElementRef<HTMLInputElement>;

	public onChange = (value: string) => {};
	public onTouched = () => {};

	public ngOnInit(): void {
		this.input.nativeElement.addEventListener('input', this.handleInput.bind(this));
	}

	public handleInput(event: Event): void {
		const input = event.target as HTMLInputElement;
		const value = input.value.replace(/[^0-9.,]/g, '');

		if (value !== input.value) {
			input.value = value;
		}

		this.onChange(value);
		this.value = value;
	}

	public writeValue(value: string): void {
		this.value = value || '';

		if (this.input) {
			this.input.nativeElement.value = this.value;
		}
	}

	public registerOnChange(fn: (value: string) => void): void {
		this.onChange = fn;
	}

	public registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	public setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;

		if (this.input) {
			this.input.nativeElement.disabled = isDisabled;
		}
	}

	public clear(): void {
		this.writeValue('');
		this.onChange('');
		this.onTouched();
	}
}
