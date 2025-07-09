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
	TextComponent,
	TextType,
	TextWeight,
} from '@front-library/components';
import { DatePipe, NgFor } from '@angular/common';
import { UntilDestroy } from '@ngneat/until-destroy';
import { toSignal } from '@angular/core/rxjs-interop';
import { OperationPlanService } from '@app/pages/production-plan/service/operation-plan.service';
import { map } from 'rxjs';
import { DatepickerCalendarComponent } from '@front-library/components/lib/components/datepicker/datepicker-calendar/datepicker-calendar.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

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
		DatepickerCalendarComponent,
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

	approveMaterial() {}

	protected readonly ButtonType = ButtonType;
	protected readonly TextType = TextType;
	protected readonly JustifyContent = JustifyContent;
	protected readonly IconPosition = IconPosition;
	protected readonly Colors = Colors;
	protected readonly TextWeight = TextWeight;
}
