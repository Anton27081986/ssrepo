import {
	ChangeDetectionStrategy,
	Component,
	effect,
	forwardRef,
	input,
	signal,
} from '@angular/core';
import {
	ControlValueAccessor,
	FormControl,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
} from '@angular/forms';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { rotateAnimation } from '@app/core/animations';
import { CaptionModule } from '@app/shared/components/typography/caption/caption.module';
import { NgClass } from '@angular/common';
import { MapperPipe } from '@app/core/pipes/mapper.pipe';
import { IconModule } from '@app/shared/components/icon/icon.module';

@Component({
	selector: 'ss-search-input-v2',
	standalone: true,
	imports: [CaptionModule, NgClass, MapperPipe, ReactiveFormsModule, IconModule],
	templateUrl: './search-input-v2.component.html',
	styleUrl: './search-input-v2.component.scss',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SearchInputV2Component),
			multi: true,
		},
	],
	animations: [rotateAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputV2Component implements ControlValueAccessor {
	public size = input<'large' | 'medium' | 'small'>('medium');
	public label = input<string>('');
	public placeholder = input<string>('Поиск');
	public options = input<IDictionaryItemDto[]>([]);
	public queryControl = input.required<FormControl<string | null>>();
	public errorText = input<string>('');
	private isSettingValue = false;

	public constructor() {
		effect(
			() => {
				this.options().length ? this.handleOptionsAvailable() : this.hideOptions();
			},
			{ allowSignalWrites: true },
		);
	}

	public showOptions = signal<boolean>(false);

	private onChange!: (value: IDictionaryItemDto | null) => void;
	private onTouched!: () => void;

	public registerOnChange(fn: (value: IDictionaryItemDto | null) => void): void {
		this.onChange = fn;
	}

	public registerOnTouched(fn: () => IDictionaryItemDto): void {
		this.onTouched = fn;
	}

	public writeValue(value: IDictionaryItemDto): void {
		if (value) {
			this.queryControl().setValue(value.name, { emitEvent: false });
			this.isSettingValue = true;
		}
	}

	public setDisabledState?(isDisabled: boolean): void {
		isDisabled ? this.queryControl().disable() : this.queryControl().enable();
	}

	public onBlur(): void {
		if (!this.options().some(item => item.name === (this.queryControl().value || ''))) {
			this.queryControl().setValue('');

			this.updateValue(null);
		}

		this.hideOptions();
	}

	public setItem(item: IDictionaryItemDto): void {
		if (item.id && item.name) {
			this.queryControl().setValue(item.name, { emitEvent: false });

			this.updateValue(item);
		}
	}

	public getControlClasses(size: string, errorText: string): string {
		return `${size}${errorText ? ' error' : ''}`;
	}

	public clear(): void {
		this.queryControl().setValue('');
		this.onChange(null);
	}

	private updateValue(item: IDictionaryItemDto | null): void {
		this.onChange(item);
		this.onTouched();
		this.hideOptions();
	}

	private handleOptionsAvailable() {
		if (this.isSettingValue) {
			this.isSettingValue = false;
		} else {
			this.showOptions.set(true);
		}
	}

	private hideOptions(): void {
		this.showOptions.set(false);
	}
}
