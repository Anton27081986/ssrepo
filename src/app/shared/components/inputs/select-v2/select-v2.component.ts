import {
	ChangeDetectionStrategy,
	Component,
	effect,
	forwardRef,
	input,
	signal,
} from '@angular/core';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import {
	ControlValueAccessor,
	FormControl,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
} from '@angular/forms';
import { rotateAnimation } from '@app/core/animations';
import { AsyncPipe, JsonPipe, NgClass, NgIf } from '@angular/common';
import { MapperPipe } from '@app/core/pipes/mapper.pipe';
import { filter, map, combineLatest, startWith } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ClickOutsideDirective } from '@app/core/directives/click-outside.directive';
import {CaptionComponent} from "@app/shared/components/typography/caption/caption.component";
import {IconComponent} from "@app/shared/components/icon/icon.component";

@Component({
	selector: 'ss-select-v2',
	standalone: true,
	imports: [
		AsyncPipe,
		NgIf,
		MapperPipe,
		ReactiveFormsModule,
		NgClass,
		JsonPipe,
		ClickOutsideDirective,
		CaptionComponent,
		IconComponent,
	],
	templateUrl: './select-v2.component.html',
	styleUrls: ['./select-v2.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [rotateAnimation],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SelectV2Component),
			multi: true,
		},
	],
})
export class SelectV2Component implements ControlValueAccessor {
	public size = input<'large' | 'medium' | 'small'>('medium');
	public label = input<string>('');
	public placeholder = input<string>('Поиск');
	public errorText = input<string>('');
	public options = input<IDictionaryItemDto[]>([]);
	public autocomplete = input<boolean>(false);

	public selectCtrl = new FormControl<string | null>('');
	public isExpanded = signal<boolean>(false);

	public filteredOptions = toSignal(
		combineLatest([
			toObservable(this.options),
			this.selectCtrl.valueChanges.pipe(startWith('')),
		]).pipe(
			filter(_ => this.autocomplete()),
			filter(([options]) => !!options),
			map(([options, value]) => {
				if (!value) {
					return options;
				}

				return options.filter(item =>
					item.name!.toLowerCase().includes(value.toLowerCase()),
				);
			}),
		),
		{
			initialValue: [],
		},
	);

	public mutableFilteredOptions = signal(this.options());

	private onChange!: (value: IDictionaryItemDto | null) => void;
	private onTouched!: () => void;

	public constructor() {
		effect(
			() => {
				this.mutableFilteredOptions.set(this.options());
			},
			{ allowSignalWrites: true },
		);

		effect(
			() => {
				if (this.autocomplete()) {
					this.mutableFilteredOptions.set(this.filteredOptions());
				}
			},
			{ allowSignalWrites: true },
		);
	}

	public registerOnChange(fn: (value: IDictionaryItemDto | null) => void): void {
		this.onChange = fn;
	}

	public registerOnTouched(fn: () => IDictionaryItemDto): void {
		this.onTouched = fn;
	}

	public writeValue(value: IDictionaryItemDto | null): void {
		if (value) {
			this.selectCtrl.setValue(value.name, { emitEvent: false });

			return;
		}

		this.selectCtrl.setValue(null, { emitEvent: false });
	}

	public setDisabledState?(isDisabled: boolean): void {
		isDisabled ? this.selectCtrl.disable() : this.selectCtrl.enable();
	}

	public onBlur(): void {
		if (!this.options().some(item => item.name === (this.selectCtrl.value || ''))) {
			this.selectCtrl.setValue('');

			this.updateValue(null);
		}

		this.hideOptions();
	}

	public setItem(item: IDictionaryItemDto): void {
		if (item.id && item.name) {
			this.selectCtrl.setValue(item.name, { emitEvent: false });

			this.updateValue(item);
		}
	}

	public getControlClasses(size: string, errorText: string, isAutocomplete: boolean): string {
		return `${size}${errorText ? ' error' : ''}${isAutocomplete ? ' autocomplete' : ''}`;
	}

	public toggle(): void {
		this.isExpanded.set(!this.isExpanded());
	}

	public clear(): void {
		this.selectCtrl.setValue('');
		this.onChange(null);
	}

	private updateValue(item: IDictionaryItemDto | null): void {
		this.onChange(item);
		this.onTouched();
		this.hideOptions();
	}

	private hideOptions(): void {
		this.isExpanded.set(false);
	}
}
