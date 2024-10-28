import {
	ChangeDetectionStrategy,
	Component,
	forwardRef,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
} from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { IFilterOption } from '@app/shared/components/filters/filters.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { BehaviorSubject, Subscription } from 'rxjs';
import { rotateAnimation } from '@app/core/animations';

@UntilDestroy()
@Component({
	selector: 'ss-multiselect-v2',
	templateUrl: './multiselect-v2.component.html',
	styleUrls: ['./multiselect-v2.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [rotateAnimation],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => MultiselectV2Component),
			multi: true,
		},
	],
})
export class MultiselectV2Component implements OnChanges, OnInit, ControlValueAccessor {
	@Input() public label: string | undefined;
	@Input() public size: 'large' | 'medium' = 'medium';
	@Input() public placeholder: string | undefined;
	@Input() public options: IFilterOption[] = [];
	@Input() public disabled: boolean = false;
	@Input() public readOnly: boolean | null = null;
	protected isExpanded: boolean = false;
	protected readonly chipsEllipsis$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
		false,
	);

	protected readonly readOnly$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	protected subscription: Subscription = new Subscription();

	private OnChange!: (value: number[]) => void;
	private OnTouched!: (value: number[]) => void;

	constructor() {
		this.subscription.add(
			this.selectedOptions$.subscribe(item => {
				if (item.length > 3) {
					this.chipsEllipsis$.next(true);
				} else {
					this.chipsEllipsis$.next(false);
				}
			}),
		);
	}

	public writeValue(value: IFilterOption[]) {
		this.selectedOptions$.next(value);
		this.viewOptions$.next([]);
	}

	public registerOnChange(fn: (value: number[]) => void): void {
		this.OnChange = fn;
	}

	public registerOnTouched(fn: () => void): void {
		this.OnTouched = fn;
	}

	protected readonly options$: BehaviorSubject<IFilterOption[]> = new BehaviorSubject<
		IFilterOption[]
	>([]);

	protected readonly viewOptions$: BehaviorSubject<IFilterOption[]> = new BehaviorSubject<
		IFilterOption[]
	>([]);

	protected readonly selectedOptions$: BehaviorSubject<IFilterOption[]> = new BehaviorSubject<
		IFilterOption[]
	>([]);

	public ngOnInit() {
		this.isExpanded = false;
	}

	protected updateStateControl() {
		this.OnChange(this.mapIds(this.selectedOptions$.value));
	}

	private mapIds(models: IDictionaryItemDto[]) {
		return models.map(val => val.id);
	}

	protected addStateOptions(item: IFilterOption) {
		if (!this.readOnly$.value) {
			item.checked = true;
			this.viewOptions$.next(this.options$.value.filter(item => !item.checked));
			const selected = this.selectedOptions$.value;

			selected.push(item);
			this.selectedOptions$.next(selected);
			this.updateStateControl();
		}
	}

	protected delSelectedOption(item: IFilterOption) {
		if (!this.readOnly$.value) {
			const oldSelected = this.selectedOptions$.value;
			item.checked = false;
			this.selectedOptions$.next(oldSelected.filter(val => val.checked));
			this.viewOptions$.next(this.options$.value.filter(item => !item.checked));
			this.updateStateControl();
		}
	}

	public ngOnChanges(changes: SimpleChanges) {
		if (changes.options) {
			this.options$.next(changes.options.currentValue ? changes.options.currentValue : []);

			if (this.options$.value.length) {
				this.viewOptions$.next(this.options$.value.filter(item => !item.checked));
			}
		}

		if (changes.readOnly) {
			this.readOnly$.next(changes.readOnly.currentValue);
		}
	}

	protected toggle() {
		this.isExpanded = !this.isExpanded;
	}

	protected clear() {
		this.isExpanded = false;
		this.options.forEach(opt => (opt.checked = false));
		this.viewOptions$.next(this.options);
		this.selectedOptions$.next([]);
	}

	protected close() {
		this.isExpanded = false;
	}
}
