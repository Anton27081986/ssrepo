import { UntilDestroy } from '@ngneat/until-destroy';
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	forwardRef,
	input,
	InputSignal,
	signal,
	WritableSignal,
} from '@angular/core';
import { rotateAnimation } from '@app/core/animations';
import {
	ButtonComponent,
	ButtonType,
	Size,
	TextType,
} from '@front-components/components';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@UntilDestroy()
@Component({
	selector: 'tr[pagination-tr]',
	templateUrl: './pagination-tr.component.html',
	styleUrls: ['./pagination-tr.component.scss'],
	standalone: true,
	animations: [rotateAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [ButtonComponent],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => PaginationTrComponent),
			multi: true,
		},
	],
})
export class PaginationTrComponent implements ControlValueAccessor {
	public countCol: InputSignal<number> = input.required<number>();
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

	protected readonly TextType = TextType;
	protected readonly ButtonType = ButtonType;
	protected readonly Size = Size;
	get viewPagination(): boolean {
		return (
			this.total() > this.limit() &&
			this.total() > this.offset() + this.limit()
		);
	}

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
