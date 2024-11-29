import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	EventEmitter,
	forwardRef,
	HostListener,
	Output,
} from '@angular/core';
import { rotateAnimation } from '@app/core/animations';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { numberInputTextMask } from '@app/core/utils/mask';
import { BehaviorSubject, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filterTruthy } from '@app/core/facades/client-proposals-facade.service';
@UntilDestroy()
@Component({
	selector: 'app-excess-income-control',
	templateUrl: './excess-income-control.component.html',
	styleUrls: ['./excess-income-control.component.scss'],
	animations: [rotateAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => ExcessIncomeControlComponent),
			multi: true,
		},
	],
})
export class ExcessIncomeControlComponent implements ControlValueAccessor {
	protected readonly numberInputTextMask = numberInputTextMask;

	public control: FormControl<number | null> = new FormControl<number | null>(
		null,
		Validators.required,
	);

	private value: number | null = null;

	protected focused$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	private onChange!: (value: number) => void;
	private onTouched!: () => void;

	@Output() valueEmit: EventEmitter<number> = new EventEmitter<number>();

	get checkValidButton(): boolean {
		return this.control.valid && Number(this.control.value) !== this.value;
	}

	@HostListener('document:click', ['$event'])
	DocumentClick(event: Event) {
		this.focused$.next(this.elem.nativeElement.contains(event.target));
	}

	constructor(private elem: ElementRef) {
		this.focused$
			.pipe(
				untilDestroyed(this),
				tap(focused => {
					if (!focused) {
						this.control.setValue(this.value);
					}
				}),
			)
			.subscribe();

		this.control.valueChanges.pipe(filterTruthy()).subscribe(value => {
			this.valueEmit.emit(value);
		});
	}

	writeValue(value: number | null) {
		this.control.setValue(value);
		this.value = value;
	}

	public registerOnChange(fn: (value: number) => void): void {
		this.onChange = fn;
	}

	public registerOnTouched(fn: () => number): void {
		this.onTouched = fn;
	}

	public outPutData() {
		const value = this.control.value;

		if (value) {
			this.onChange(Number(value));
			this.value = Number(value);
		}
	}
}
