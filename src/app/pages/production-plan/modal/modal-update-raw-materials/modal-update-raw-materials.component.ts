import {
	ChangeDetectionStrategy,
	Component,
	inject,
	LOCALE_ID,
	signal,
	Signal,
	WritableSignal,
} from '@angular/core';
import {
	ButtonComponent,
	ButtonType,
	Colors,
	DropdownItemComponent,
	DropdownListComponent,
	ExtraSize,
	IconType,
	IDictionaryItemDto,
	JustifyContent,
	ModalComponent,
	ModalRef,
	PopoverTriggerForDirective,
	Shape,
	SharedPopupService,
	TextComponent,
	TextType,
	ToastTypeEnum,
	IconPosition,
} from '@front-library/components';
import { DatePipe, NgFor } from '@angular/common';
import { OperationPlanService } from '@app/pages/production-plan/service/operation-plan.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { EMPTY, map } from 'rxjs';
import {
	OperationPlanRequest,
	Pagination,
} from '@app/core/models/production-plan/operation-plan';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError } from 'rxjs/operators';

export interface UpdateRawMaterialsData {
	day: string;
	tovIds?: number[];
	filterParams?: OperationPlanRequest & Pagination;
	weekId: number;
	total: number;
}

@Component({
	selector: 'app-modal-update-raw-materials',
	standalone: true,
	imports: [
		NgFor,
		TextComponent,
		ButtonComponent,
		ModalComponent,
		DatePipe,
		PopoverTriggerForDirective,
		DropdownListComponent,
		DropdownItemComponent,
	],
	templateUrl: './modal-update-raw-materials.component.html',
	styleUrl: './modal-update-raw-materials.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [{ provide: LOCALE_ID, useValue: 'ru' }],
})
@UntilDestroy()
export class ModalUpdateRawMaterialsComponent {
	private readonly operationPlanService = inject(OperationPlanService);
	private readonly sharedService = inject(SharedPopupService);
	protected readonly ExtraSize = ExtraSize;
	protected readonly IconType = IconType;
	protected readonly Shape = Shape;

	protected data: UpdateRawMaterialsData;

	protected calcVariants: Signal<IDictionaryItemDto[]> = toSignal(
		this.operationPlanService.getCalcVariants().pipe(
			map((value) => {
				return value.items;
			}),
		),
		{ initialValue: [] },
	);

	protected selectedItem: WritableSignal<IDictionaryItemDto | null> =
		signal(null);

	private readonly popup: ModalRef<UpdateRawMaterialsData> = inject(
		ModalRef<UpdateRawMaterialsData>,
	);

	constructor() {
		this.data = this.popup.data;
	}

	protected close() {
		this.popup.close();
	}

	protected updateRawMaterial() {
		const calcVariant = this.selectedItem();
		if (calcVariant) {
			this.operationPlanService
				.updateRawMaterial({
					filterParams: this.data.filterParams!,
					weekId: this.data.weekId,
					calcVariantId: calcVariant.id,
					calcDate: this.data.day,
				})
				.pipe(
					untilDestroyed(this),
					catchError((error) => {
						this.close();
						return EMPTY;
					}),
				)
				.subscribe((val) => {
					window.open(val.linkToModule, '_blank');
					this.close();
				});
		} else {
			this.sharedService.openToast({
				type: ToastTypeEnum.Error,
				text: 'Вариант расчета не выбран',
			});
		}
	}

	protected readonly ButtonType = ButtonType;
	protected readonly JustifyContent = JustifyContent;
	protected readonly IconPosition = IconPosition;
	protected readonly TextType = TextType;
	protected readonly Colors = Colors;
	protected readonly document = document;
}
