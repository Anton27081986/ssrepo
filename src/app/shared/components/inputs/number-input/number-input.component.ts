import {
	ChangeDetectionStrategy,
	Component,
	forwardRef,
	input,
	signal,
	WritableSignal,
} from '@angular/core';
import { AsyncPipe, CommonModule, NgClass } from '@angular/common';
import {
	ControlValueAccessor,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
} from '@angular/forms';
import { MapperPipe } from '@app/core/pipes/mapper.pipe';
import { ICON_PADDING } from '@app/shared/components/inputs/input-v2/constants/icon-padding';
import { BehaviorSubject } from 'rxjs';
import { CaptionComponent } from '@app/shared/components/typography/caption/caption.component';
import { IconComponent } from '@app/shared/components/icon/icon.component';

@Component({
	selector: 'ss-number-input-v2',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MapperPipe,
		NgClass,
		AsyncPipe,
		CaptionComponent,
		IconComponent,
	],
	templateUrl: './number-input.component.html',
	styleUrl: './number-input.component.scss',
	host: {
		'(blur)': 'onTouched()',
	},
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => NumberInputComponent),
			multi: true,
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumberInputComponent implements ControlValueAccessor {
	public size = input<'large' | 'medium' | 'small'>('medium');
	public label = input<string>('');
	public placeholder = input<string>('Поиск');
	public maxlength = input<number>(256);
	public step = input<number>(0.01);
	public showClearButton = input<boolean>(true);
	public errorText = input<string>('');
	public value$: BehaviorSubject<number | null> = new BehaviorSubject<
		number | null
	>(null);

	protected disabled: WritableSignal<boolean> = signal(false);

	private onChange!: (value: number | null) => void;
	protected onTouched!: () => void;

	public writeValue(value: number | null): void {
		this.value$.next(value);
	}

	public registerOnChange(fn: (value: number | null) => void): void {
		this.onChange = fn;
	}

	public registerOnTouched(fn: () => number | null): void {
		this.onTouched = fn;
	}

	public getControlClasses(size: string, errorText: string): string {
		return `${size}${errorText ? ' error' : ''}`;
	}

	public onInput(event: Event): void {
		const inputElement = event.target as HTMLInputElement;

		const value = inputElement.value;

		this.updateControl(value.trim() ? Number(value) : null);
	}

	public iconPaddingCalc(iconNum: number): number {
		return iconNum * ICON_PADDING + ICON_PADDING;
	}

	updateControl(value: number | null) {
		if (value === 0) {
			value = null;
		}

		this.value$.next(value);
		this.onChange(value);
	}

	setDisabledState(isDisabled: boolean) {
		this.disabled.set(isDisabled);
	}

	valueUp() {
		const result = Number(
			((this.value$.value ?? 0) + this.step()).toFixed(2),
		);

		this.updateControl(result);
	}

	valueDown() {
		const result = Number(
			((this.value$.value ?? 0) - this.step()).toFixed(2),
		);

		this.updateControl(result < 0 ? 0 : result);
	}
}
