import {
	ChangeDetectionStrategy,
	Component,
	inject,
	OnInit,
	signal,
	Signal,
	WritableSignal,
	OnDestroy,
} from '@angular/core';
import {
	BadgeComponent,
	ButtonComponent,
	CheckboxComponent,
	DividerComponent,
	DropdownItemComponent,
	DropdownListComponent,
	ExtraSize,
	FieldCtrlDirective,
	FormFieldComponent,
	IconType,
	IDictionaryItemDto,
	InputComponent,
	ModalComponent,
	ModalRef,
	PopoverTriggerForDirective,
	SharedPopupService,
	SpinnerComponent,
	TextComponent,
	ToastTypeEnum,
	Shape,
	ButtonType,
	TextType,
	TextWeight,
	JustifyContent,
	Colors,
	Align,
	Status,
} from '@front-library/components';
import { OperationPlanService } from '@app/pages/production-plan/service/operation-plan.service';
import { ManufacturingSelectedTovs } from '@app/core/models/production-plan/manufacturing-tovs';
import { IconPosition, Size } from '@front-components/components';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
	BehaviorSubject,
	debounceTime,
	map,
	scan,
	switchMap,
	take,
	tap,
	Subscription,
} from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import {
	AddToVRequest,
	toVRequest,
} from '@app/core/models/production-plan/add-tov-request';

export enum TovEventEnum {
	default = 0,
	changeQuery = 1,
	changePage = 2,
}

export interface AddManufacturesPopup {
	weekId: number;
}

@Component({
	selector: 'app-add-manufactures-popup',
	standalone: true,
	imports: [
		ModalComponent,
		ButtonComponent,
		InputComponent,
		FormFieldComponent,
		FieldCtrlDirective,
		InputComponent,
		FormFieldComponent,
		FormFieldComponent,
		FieldCtrlDirective,
		NgFor,
		TextComponent,
		CheckboxComponent,
		DividerComponent,
		NgIf,
		DropdownItemComponent,
		DropdownListComponent,
		PopoverTriggerForDirective,
		BadgeComponent,
		SpinnerComponent,
		ReactiveFormsModule,
		NgTemplateOutlet,
	],
	templateUrl: './add-manufactures-popup.component.html',
	styleUrl: './add-manufactures-popup.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddManufacturesPopupComponent implements OnInit, OnDestroy {
	protected readonly ExtraSize = ExtraSize;
	protected readonly Shape = Shape;
	protected readonly IconType = IconType;
	protected readonly ButtonType = ButtonType;
	protected readonly Size = Size;
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly IconPosition = IconPosition;
	protected readonly JustifyContent = JustifyContent;
	protected readonly Colors = Colors;
	protected readonly Align = Align;

	protected readonly queryControl: FormControl<string | null> =
		new FormControl<string | null>('');

	protected readonly sharedService: SharedPopupService =
		inject(SharedPopupService);

	protected readonly limit: number = 60;
	protected total: number | null = null;

	protected readonly popup: ModalRef<AddManufacturesPopup> = inject(
		ModalRef<AddManufacturesPopup>,
	);

	protected isVisibleModal: WritableSignal<boolean> = signal(true);
	protected blockOffset: WritableSignal<boolean> = signal(false);
	protected isLoaderMain: WritableSignal<boolean> = signal(false);
	protected isLoader: WritableSignal<boolean> = signal(false);

	protected tovEvent: BehaviorSubject<TovEventEnum> =
		new BehaviorSubject<TovEventEnum>(TovEventEnum.default);

	protected offset: WritableSignal<number> = signal<number>(0);
	private readonly operationPlanService = inject(OperationPlanService);

	protected selectedTov: WritableSignal<ManufacturingSelectedTovs[]> = signal(
		[],
	);

	protected tov: Signal<ManufacturingSelectedTovs[]> = toSignal(
		this.tovEvent.pipe(
			switchMap((event) => {
				let query = '';
				this.blockOffset.set(true);

				if (event === TovEventEnum.changeQuery) {
					this.isLoaderMain.set(true);
					query = this.queryControl.value ?? '';
					const elem = document.getElementsByClassName(
						'ss-lib-popup-global-scrolled',
					);

					const elemItem = elem.item(0);

					if (elemItem) {
						elemItem.scrollTop = 0;
					}
				}

				if (event === TovEventEnum.changePage) {
					this.isLoader.set(true);
				}

				if (event === TovEventEnum.default) {
					this.isLoaderMain.set(true);
				}

				return this.operationPlanService.getManufacturingTov(
					query,
					this.limit,
					this.offset(),
				);
			}),
			map((tov) => {
				this.total = tov.total;

				return tov.items.map((item) => {
					return {
						tov: item.tov,
						section: item.section,
						selected: new FormControl<boolean | null>(false),
						selectedSection: null,
					};
				});
			}),
			scan((acc, value) => {
				if (this.tovEvent.value === TovEventEnum.changeQuery) {
					return value;
				}

				return [...acc, ...value];
			}),
			tap((_item) => {
				this.isLoaderMain.set(false);
				this.isLoader.set(false);
				this.blockOffset.set(false);
			}),
		),
		{
			initialValue: [],
		},
	);

	private readonly subscriptions: Subscription[] = [];

	constructor() {
		toSignal(
			this.queryControl.valueChanges.pipe(
				debounceTime(1000),
				tap((_value) => {
					this.offset.set(0);
					this.tovEvent.next(TovEventEnum.changeQuery);
				}),
			),
		);
	}

	ngOnInit(): void {
		window.addEventListener(
			'scroll',
			() => {
				const elem = document.getElementsByClassName(
					'ss-lib-popup-global-scrolled',
				);

				const elemItem = elem.item(0);

				if (elemItem && !this.blockOffset()) {
					if (
						elemItem.scrollHeight -
							elemItem.clientHeight -
							elemItem.scrollTop ===
						0
					) {
						this.offset.set(this.offset() + this.limit);
						this.tovEvent.next(TovEventEnum.changePage);
					}
				}
			},
			true,
		);
	}

	protected add(): void {
		if (this.selectedTov().length > 0) {
			if (this.checkForUnselectedItems()) {
				this.sharedService.openToast({
					type: ToastTypeEnum.Error,
					text: 'У некоторых полуфабрикатов не выбран участок',
				});
			} else {
				const mapTovRequest: toVRequest[] = this.selectedTov().map(
					(tov) => {
						return {
							sectionId: tov.selectedSection?.id as number,
							tovId: tov.tov.id as number,
						};
					},
				);

				const params: AddToVRequest = {
					weekId: this.popup.data.weekId,
					items: mapTovRequest,
				};

				const sub = this.operationPlanService
					.addGp(params)
					.subscribe(() => this.popup.close());
				this.subscriptions.push(sub);
			}
		} else {
			this.sharedService.openToast({
				type: ToastTypeEnum.Error,
				text: 'выберите элементы',
			});
		}
	}

	private checkForUnselectedItems(): boolean {
		return this.selectedTov().some((item) => {
			return item.selectedSection === null;
		});
	}

	protected close(): void {
		// if (this.selectedTov().length > 0) {
		// 	this.isVisibleModal.set(false);
		// 	const confirmModal = this.confirmIfCloseForm();
		//
		// 	const sub1 = confirmModal.afterSubmit$
		// 		.pipe(
		// 			take(1),
		// 			tap(() => {
		// 				this.popup.close();
		// 			}),
		// 		)
		// 		.subscribe();
		// 	this.subscriptions.push(sub1);
		//
		// 	const sub2 = confirmModal.afterClosed$
		// 		.pipe(
		// 			take(1),
		// 			tap(() => {
		// 				this.isVisibleModal.set(true);
		// 			}),
		// 		)
		// 		.subscribe();
		// 	this.subscriptions.push(sub2);
		// } else {
		// 	this.popup.close();
		// }
		this.popup.close();
	}

	public confirmIfCloseForm(): ModalRef {
		return this.sharedService.openConfirmModal(
			{
				title: 'Выйти без сохранения ?',
				description: 'Все изменения будут утеряны.',
				badgeProps: {
					icon: IconType.Alert,
					status: Status.Warning,
				},
				apply: {
					text: 'Выйти',
				},
				cancelText: 'Остаться',
			},
			false,
		);
	}

	protected addTovSelected(tov: ManufacturingSelectedTovs): void {
		tov.selected.setValue(false);

		const arrTov = this.selectedTov();

		const cloneTov: ManufacturingSelectedTovs = JSON.parse(
			JSON.stringify(tov),
		);

		cloneTov.selected = new FormControl(true);

		arrTov.push(cloneTov);

		this.selectedTov.set(arrTov);
	}

	protected removeTovSelected(tov: ManufacturingSelectedTovs): void {
		tov.selected.setValue(false);

		const arrTov = this.selectedTov().filter(
			(item) => item.tov !== tov.tov,
		);

		this.selectedTov.set(arrTov);
	}

	protected deleteSelected(): void {
		this.selectedTov.set([]);
	}

	protected selectOpt(
		item: ManufacturingSelectedTovs,
		section: IDictionaryItemDto,
	): void {
		item.selectedSection = section;
	}

	ngOnDestroy(): void {
		this.subscriptions.forEach((sub) => sub.unsubscribe());
	}
}
