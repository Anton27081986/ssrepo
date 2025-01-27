import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	forwardRef,
	HostListener,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
} from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { IFilterOption } from '@app/shared/components/filters/filters.component';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { BehaviorSubject, Subscription } from 'rxjs';
import { rotateAnimation } from '@app/core/animations';
import {CaptionComponent} from "@app/shared/components/typography/caption/caption.component";
import {AsyncPipe, CommonModule} from "@angular/common";
import {
	MultiselectChipsV2Component
} from "@app/shared/components/multiselect-v2/multiselect-chips-v2/multiselect-chips-v2.component";
import {IconComponent} from "@app/shared/components/icon/icon.component";
import {
	MultiselectOptionV2Component
} from "@app/shared/components/multiselect-v2/multiselect-option-v2/multiselect-option-v2.component";
import {SsDividerComponent} from "@app/shared/components/ss-divider/ss-divider.component";

@UntilDestroy()
@Component({
	selector: 'ss-multiselect-autocomplete-v2',
	templateUrl: './multiselect-autocomplete-v2.component.html',
	styleUrls: ['./multiselect-autocomplete-v2.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [rotateAnimation],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => MultiselectAutocompleteV2Component),
			multi: true,
		},
	],
	imports: [
		CommonModule,
		CaptionComponent,
		AsyncPipe,
		ReactiveFormsModule,
		MultiselectChipsV2Component,
		IconComponent,
		MultiselectOptionV2Component,
		SsDividerComponent
	],
	standalone: true
})
export class MultiselectAutocompleteV2Component implements OnChanges, OnInit, ControlValueAccessor {
	@Input() public label: string | undefined;
	@Input() public size: 'large' | 'medium' = 'medium';
	@Input() public placeholder: string | undefined;
	@Input() public options: IFilterOption[] = [];
	@Input() public disabled: boolean = false;
	@Input() public readOnly: boolean | null = null;
	@Input() public queryControl: FormControl<string | null> = new FormControl<string | null>(null);
	protected isExpanded: boolean = false;
	protected readonly chipsEllipsis$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
		false,
	);

	protected readonly readOnly$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	protected subscription: Subscription = new Subscription();

	private OnChange!: (value: number[]) => void;
	private OnTouched!: (value: number[]) => void;

	get getViewSelect(): boolean {
		return (
			(this.isExpanded && this.selectedOptions$?.value.length > 0) ||
			(this.isExpanded && this.viewOptions$.value.length > 0)
		);
	}

	@HostListener('document:click', ['$event'])
	DocumentClick(event: Event) {
		if (this.isExpanded) {
			this.isExpanded = this.elem.nativeElement.contains(event.target);
		}
	}

	constructor(private readonly elem: ElementRef) {
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
		if (!this.readOnly) {
			item.checked = true;
			this.viewOptions$.next(this.options$.value.filter(item => !item.checked));
			const selected = this.selectedOptions$.value;

			selected.push(item);
			this.selectedOptions$.next(selected);
			this.updateStateControl();
		}
	}

	protected delSelectedOption(item: IFilterOption) {
		if (!this.readOnly) {
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

			this.isExpanded = true;
		}

		if (changes.readOnly) {
			this.readOnly$.next(changes.readOnly.currentValue);
		}
	}

	protected toggle() {
		this.isExpanded = !this.isExpanded;
	}

	protected clear() {
		this.queryControl.setValue(null);
		this.options = [];
		this.viewOptions$.next([]);
		this.selectedOptions$.next([]);
		this.isExpanded = false;
		this.updateStateControl();
	}

	protected close() {
		this.isExpanded = false;
	}
}
