import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	forwardRef,
	Input,
	signal,
	WritableSignal,
} from '@angular/core';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
	selector: 'ss-select-v2',
	templateUrl: './select-v2.component.html',
	styleUrls: ['./select-v2.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SelectV2Component),
			multi: true,
		},
	],
})
export class SelectV2Component implements ControlValueAccessor {
	@Input() public size: 'large' | 'medium' | 'small' = 'medium';
	@Input() public label: string | undefined;
	@Input() public error: string | undefined;
	@Input() public disabled: boolean = false;
	@Input() public options: IDictionaryItemDto[] = [];
	@Input() public placeholder: string = '';
	protected selected: WritableSignal<number | null> = signal(null);

	private OnChange!: (value: IDictionaryItemDto) => void;
	private OnTouched!: (value: number) => void;

	constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

	writeValue(value: IDictionaryItemDto) {
		this.selected.set(value.id);
		this.changeDetectorRef.detectChanges();
	}

	public registerOnChange(fn: (value: IDictionaryItemDto) => void): void {
		this.OnChange = fn;
	}

	public registerOnTouched(fn: () => void): void {
		this.OnTouched = fn;
	}

	public onClick(el: EventTarget | null) {
		if (el) {
			const value = Number((el as HTMLSelectElement).value);
			const checkValue = this.options.find(opt => opt.id === value);
			if (checkValue) {
				this.OnChange(checkValue);
			}
		}
	}
}
