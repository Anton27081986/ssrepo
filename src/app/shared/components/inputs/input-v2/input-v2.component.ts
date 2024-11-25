import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	EventEmitter,
	forwardRef,
	input,
	Output,
	signal,
	WritableSignal,
} from '@angular/core';
import { CaptionModule } from '@app/shared/components/typography/caption/caption.module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { NgClass, NgIf } from '@angular/common';
import {
	ControlValueAccessor,
	FormControl,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
} from '@angular/forms';
import { MapperPipe } from '@app/core/pipes/mapper.pipe';
import { IInputIcon } from '@app/shared/components/inputs/input-v2/models/input-icon';
import { InputIconTypeEnum } from '@app/shared/components/inputs/input-v2/models/input-icon-type';
import { ICON_PADDING } from '@app/shared/components/inputs/input-v2/constants/icon-padding';

@Component({
	selector: 'ss-input-v2',
	standalone: true,
	imports: [CaptionModule, IconModule, NgIf, ReactiveFormsModule, MapperPipe, NgClass],
	templateUrl: './input-v2.component.html',
	styleUrl: './input-v2.component.scss',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => InputV2Component),
			multi: true,
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputV2Component implements ControlValueAccessor {
	public size = input<'large' | 'medium' | 'small'>('medium');
	public label = input<string>('');
	public placeholder = input<string>('Поиск');
	public maxlength = input<string>('256');
	public type = input<'text' | 'email' | 'number' | 'password'>('text');
	public showClearButton = input<boolean>(true);
	public errorText = input<string>('');

	public inputCtrl = new FormControl<string>('');
	public passwordIcon: WritableSignal<'eyeSlash' | 'eye'> = signal('eyeSlash');
	public mutableType = signal(this.type());

	@Output() focused: EventEmitter<boolean> = new EventEmitter<boolean>(false);

	public icons: WritableSignal<IInputIcon[]> = signal([
		{
			type: InputIconTypeEnum.Close,
			iconName: 'close',
			action: this.clear.bind(this),
			visible: false,
		},
		{
			type: InputIconTypeEnum.Password,
			iconName: 'eyeSlash',
			action: this.onChangePasswordVisibility.bind(this),
			visible: false,
		},
	]);

	public filteredIcons = computed(() => {
		return this.icons().filter(icon => icon.visible);
	});

	public constructor() {
		effect(
			() => {
				this.mutableType.set(this.type());
			},
			{ allowSignalWrites: true },
		);

		effect(
			() => {
				if (this.type() === 'password') {
					this.updateIconsVisibility(InputIconTypeEnum.Password, 'visible', true);
				}
			},
			{ allowSignalWrites: true },
		);

		effect(
			() => {
				if (this.type() === 'password') {
					this.updateIconsVisibility(
						InputIconTypeEnum.Password,
						'iconName',
						this.passwordIcon(),
					);
				}
			},
			{ allowSignalWrites: true },
		);
	}

	private onChange!: (value: string) => void;
	private onTouched!: () => void;

	public writeValue(value: string): void {
		this.inputCtrl.setValue(value);
	}

	public registerOnChange(fn: (value: string) => void): void {
		this.onChange = fn;
	}

	public registerOnTouched(fn: () => string): void {
		this.onTouched = fn;
	}

	public setDisabledState(isDisabled: boolean): void {
		isDisabled ? this.inputCtrl.disable() : this.inputCtrl.enable();
	}

	public onChangePasswordVisibility(): void {
		if (this.mutableType() === 'password') {
			this.mutableType.set('text');
			this.passwordIcon.set('eye');

			return;
		}

		this.mutableType.set('password');
		this.passwordIcon.set('eyeSlash');
	}

	public clear(): void {
		this.inputCtrl.setValue('');
		this.onChange('');
	}

	public getControlClasses(size: string, errorText: string): string {
		return `${size}${errorText ? ' error' : ''}`;
	}

	public onInput(event: Event): void {
		const inputElement = event.target as HTMLInputElement;

		const value = inputElement.value;

		if (this.showClearButton()) {
			this.updateIconsVisibility(InputIconTypeEnum.Close, 'visible', !!value);
		}

		this.onChange(value);
	}

	public onBlur() {
		this.focused.emit(false);
	}

	public onFocus() {
		this.focused.emit(true);
	}

	public iconPaddingCalc(iconNum: number): number {
		return iconNum * ICON_PADDING + ICON_PADDING;
	}

	private updateIconsVisibility(
		type: InputIconTypeEnum,
		property: keyof IInputIcon,
		value: unknown,
	): void {
		this.icons.update(items =>
			items.map(item => (item.type === type ? { ...item, [property]: value } : item)),
		);
	}

	protected readonly onfocus = onfocus;
}
