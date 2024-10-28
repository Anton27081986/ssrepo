import { ChangeDetectionStrategy, Component, effect, forwardRef, Input } from '@angular/core';
import {
	AbstractControl,
	ControlValueAccessor,
	FormControl,
	FormGroup,
	NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { EMPTY_FUNCTION } from '@app/core/constants/empty';
import { DATE_TIME_PICKER_PROVIDERS } from '@app/shared/components/inputs/date-time-picker/providers/date-time-picker.provider';
import { TIME_FORMAT_DELIMITED } from '@app/shared/components/inputs/date-time-picker/utils';
import { IDatetime } from '@app/shared/components/inputs/date-time-picker/models/date-time.interface';
import { SSForm } from '@app/core/models/form';
import { DateTimePickerImports } from '@app/shared/components/inputs/date-time-picker/date-time-picker.imports';
import { dateInputTextMask } from '@app/core/utils/mask';
import { getTime } from '@app/core/utils/date';

@Component({
	selector: 'ss-date-time-picker',
	standalone: true,
	imports: [DateTimePickerImports],
	templateUrl: './date-time-picker.component.html',
	styleUrl: './date-time-picker.component.scss',
	providers: [
		DATE_TIME_PICKER_PROVIDERS,
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => DateTimePickerComponent),
			multi: true,
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateTimePickerComponent implements ControlValueAccessor {
	@Input() public showDate = true;
	@Input() public showTime = true;
	@Input() public clearDate = false;
	@Input() public readonly = false;

	@Input()
	public get value(): string | null {
		return null;
	}

	public set value(initialDate: string | null) {
		const hasDate = initialDate ? new Date(initialDate) : null;
		const time = hasDate ? getTime(hasDate) : TIME_FORMAT_DELIMITED;

		if (hasDate && time) {
			this.form.setValue({ date: hasDate, time });
		}
	}

	public form = new FormGroup<SSForm<IDatetime>>({
		date: new FormControl<Date | null>(null),
		time: new FormControl<string | null>(null),
	});

	public date$ = toSignal(this.dateCtrl.valueChanges, {
		initialValue: null,
	});

	public time$ = toSignal(this.timeCtrl.valueChanges, { initialValue: null });

	protected readonly dateInputTextMask = dateInputTextMask;

	private onChange = EMPTY_FUNCTION;
	private onTouched = EMPTY_FUNCTION;

	public constructor() {
		effect(() => {
			if (this.showDate) {
				this.dateChanges(this.date$());
			}
		});

		effect(() => {
			if (this.showTime) {
				this.timeChanges(this.time$());
			}
		});
	}

	private get dateCtrl(): AbstractControl {
		return this.form.get('date') as AbstractControl;
	}

	private get timeCtrl(): AbstractControl {
		return this.form.get('time') as AbstractControl;
	}

	public clearControls(): void {
		this.dateCtrl.setValue(null);

		if (this.showTime) {
			this.timeCtrl.setValue(null);
			this.timeCtrl.disable();
		}
	}

	public writeValue(val: null): void {
		this.value = val;
	}

	public registerOnChange(fn: Function): void {
		this.onChange = fn;
	}

	public registerOnTouched(fn: Function): void {
		this.onTouched = fn;
	}

	private dateChanges(date: Date | null): void {
		if (this.showDate && this.showTime) {
			if (date) {
				this.timeCtrl.enable();
			} else {
				this.timeCtrl.disable();
				this.timeCtrl.setValue(null);
			}
		}

		date ? this.dateTimeChange(this.setTime(date, this.time$())) : this.dateTimeChange('');
	}

	private timeChanges(time: string | null): void {
		if (this.showDate && this.dateCtrl.value) {
			this.dateTimeChange(this.setTime(this.dateCtrl.value, time));

			return;
		}

		this.dateTimeChange(time || '');
	}

	private setTime(date: Date, time: string | null): string {
		// eslint-disable-next-line prefer-const
		let [hours, minutes] = (time || TIME_FORMAT_DELIMITED).split(':').map(Number);

		const dateCopy = new Date(date);

		dateCopy.setHours(hours - date.getTimezoneOffset() / 60, minutes);

		return dateCopy.toISOString();
	}

	private dateTimeChange(data: string): void {
		this.onChange(data);
	}
}
