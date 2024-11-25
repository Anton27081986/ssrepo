import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	EventEmitter,
	forwardRef,
	input,
	InputSignal,
	OnInit,
	Output,
	signal,
	Signal,
	WritableSignal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
	selector: 'ss-dynamic-pagination',
	templateUrl: './dynamic-pagination.component.html',
	styleUrls: ['./dynamic-pagination.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => DynamicPaginationComponent),
			multi: true,
		},
	],
})
export class DynamicPaginationComponent implements ControlValueAccessor {
	public total: InputSignal<number> = input.required<number>();
	public limit: InputSignal<number> = input.required<number>();
	public offset: WritableSignal<number> = signal<number>(0);
	public remainder = computed(() => {
		if (this.limit() > this.total()) {
			return this.limit() - this.total();
		}
		return this.limit();
	});

	private OnChange!: (value: number) => void;
	private OnTouched!: (value: number) => void;

	writeValue(offset: number | null) {
		if (offset) {
			this.offset.set(offset);
		}
	}

	public registerOnChange(fn: (value: number) => void): void {
		this.OnChange = fn;
	}

	public registerOnTouched(fn: () => void): void {
		this.OnTouched = fn;
	}

	nextOffset() {
		this.OnChange(this.offset() + this.limit());
		this.offset.set(this.offset() + this.limit());
	}
}
