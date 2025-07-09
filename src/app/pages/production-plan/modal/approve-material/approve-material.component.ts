import {
	ChangeDetectionStrategy,
	Component,
	inject,
	LOCALE_ID,
	OnInit,
	signal,
	Signal,
	WritableSignal,
} from '@angular/core';
import {
	ButtonComponent,
	ButtonType,
	Colors,
	DatepickerComponent,
	DropdownItemComponent,
	DropdownListComponent,
	ExtraSize,
	FieldCtrlDirective,
	FormFieldComponent,
	IconPosition,
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
	TextWeight,
	ToastTypeEnum,
} from '@front-library/components';
import { DatePipe, NgFor } from '@angular/common';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { toSignal } from '@angular/core/rxjs-interop';
import { OperationPlanService } from '@app/pages/production-plan/service/operation-plan.service';
import { map } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ApproveMaterialRequest } from '@app/core/models/production-plan/approve-materials';

export interface ApproveMaterialData {
	total: number;
	dataStart: Date;
}

@Component({
	selector: 'app-approve-material',
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
		DatepickerComponent,
		FormFieldComponent,
		FieldCtrlDirective,
		ReactiveFormsModule,
	],
	templateUrl: './approve-material.component.html',
	styleUrl: './approve-material.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [{ provide: LOCALE_ID, useValue: 'ru' }],
})
@UntilDestroy()
export class ApproveMaterialComponent implements OnInit {
	protected readonly IconType = IconType;
	protected readonly ExtraSize = ExtraSize;
	protected readonly Shape = Shape;
	private readonly popup: ModalRef<ApproveMaterialData> = inject(
		ModalRef<ApproveMaterialData>,
	);

	private readonly sharedService = inject(SharedPopupService);

	protected startDate: FormControl<null | Date> =
		new FormControl<null | Date>(null);

	protected endDate: FormControl<null | Date> = new FormControl<null | Date>(
		null,
	);

	private readonly service: OperationPlanService =
		inject(OperationPlanService);

	protected city: WritableSignal<IDictionaryItemDto | null> = signal(null);

	protected cities: Signal<IDictionaryItemDto[]> = toSignal(
		this.service.getCities().pipe(
			map((value) => {
				return value.items;
			}),
		),
		{ initialValue: [] },
	);

	protected data: ApproveMaterialData;

	constructor() {
		this.data = this.popup.data;
	}

	ngOnInit() {
		this.startDate.setValue(this.data.dataStart);

		this.startDate.disable();

		this.endDate.setValue(this.data.dataStart);
	}

	protected close() {
		this.popup.close();
	}

	protected approveMaterial() {
		const city = this.city();
		if (city) {
			const params: ApproveMaterialRequest = {
				dateFrom: this.startDate.value?.toString()!,
				dateTo: this.endDate.value?.toISOString()!,
				cityId: city.id,
			};
			this.service
				.approveMaterials(params)
				.pipe(untilDestroyed(this))
				.subscribe((value) => {
					window.open(value.linkToModule, '_target');
				});
		} else {
			this.sharedService.openToast({
				type: ToastTypeEnum.Error,
				text: 'Выберите город',
			});
		}
	}

	protected readonly ButtonType = ButtonType;
	protected readonly TextType = TextType;
	protected readonly JustifyContent = JustifyContent;
	protected readonly IconPosition = IconPosition;
	protected readonly Colors = Colors;
	protected readonly TextWeight = TextWeight;
}
