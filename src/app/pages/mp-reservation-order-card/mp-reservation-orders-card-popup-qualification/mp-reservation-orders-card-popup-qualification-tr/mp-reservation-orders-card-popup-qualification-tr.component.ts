import {
	AfterViewChecked,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnInit,
	Output,
	ViewChild,
} from '@angular/core';
import { ColumnsStateService } from '@app/core/columns.state.service';
import { IStoreTableBaseColumn } from '@app/core/store';
import { TooltipPosition, TooltipTheme } from '@app/shared/components/tooltip/tooltip.enums';
import { BehaviorSubject, Observable } from 'rxjs';
import { ModalService } from '@app/core/modal/modal.service';
import { TableFullCellComponent } from '@app/shared/components/table-full-cell/table-full-cell.component';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { ClientProposalsFacadeService } from '@app/core/facades/client-proposals-facade.service';
import {
	AsyncPipe,
	CommonModule,
	NgForOf,
	NgIf,
	NgSwitch,
	NgSwitchCase,
	NgSwitchDefault,
} from '@angular/common';
import { TextComponent } from '@app/shared/components/typography/text/text.component';
import { SelectComponent } from '@app/shared/components/select/select.component';
import { InputComponent } from '@app/shared/components/inputs/input/input.component';
import { SearchInputComponent } from '@app/shared/components/inputs/search-input/search-input.component';
import { DateTimePickerComponent } from '@app/shared/components/inputs/date-time-picker/date-time-picker.component';
import { IOrderChangeQualification } from '@app/core/models/mp-reservation-orders/mp-reservation-order-change-qualification';
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {InputType} from "@front-components/components";

export enum QualificationTrRowItemField {
	amount = 'amount',
	requestedProvisionDate = 'requestedProvisionDate',
}

@UntilDestroy()
@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'tr[mp-reservation-orders-card-popup-qualification-tr]',
	styleUrls: ['mp-reservation-orders-card-popup-qualification-tr.component.scss'],
	templateUrl: './mp-reservation-orders-card-popup-qualification-tr.component.html',
	imports: [
		CommonModule,
		NgForOf,
		AsyncPipe,
		NgSwitch,
		NgIf,
		NgSwitchCase,
		TextComponent,
		SelectComponent,
		InputComponent,
		SearchInputComponent,
		NgSwitchDefault,
		DateTimePickerComponent,
		FormsModule,
		ReactiveFormsModule,
	],
	standalone: true,
})
export class MpReservationOrdersCardPopupQualificationTrComponent
	implements OnInit, AfterViewChecked
{
	protected readonly TooltipTheme = TooltipTheme;
	protected readonly TooltipPosition = TooltipPosition;
	protected readonly Number = Number;

	protected readonly QualificationTrRowItemField = QualificationTrRowItemField;
	protected tprRejectsReasons$: Observable<IDictionaryItemDto[]>;

	@Input({ required: true }) item!: IOrderChangeQualification;
	@Input() defaultCols: IStoreTableBaseColumn[] = [];

	protected viewMaximise$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	@ViewChild('content') public content!: ElementRef;

	@Output() checkForm: EventEmitter<boolean> = new EventEmitter<boolean>();

	public qualificationTrForm!: FormGroup<{
		amount: FormControl<number>;
		dateProvision: FormControl<string>;
	}>;

	constructor(
		public readonly columnsStateService: ColumnsStateService,
		private readonly clientProposalsFacadeService: ClientProposalsFacadeService,
		private readonly modalService: ModalService,
	) {
		this.tprRejectsReasons$ = this.clientProposalsFacadeService.tprRejectsReasons$;
	}

	ngOnInit() {
		this.columnsStateService.colsTr$.next([
			{
				cols: [
					{
						id: QualificationTrRowItemField.amount,
						title: 'Количество',
						order: 1,
						show: true,
						colspan: 1,
						rowspan: 1,
						display: true,
					},
					{
						id: QualificationTrRowItemField.requestedProvisionDate,
						title: 'Желаемая дата',
						order: 2,
						show: true,
						colspan: 1,
						rowspan: 1,
						display: true,
					},
				],
			},
		]);

		this.qualificationTrForm = new FormGroup({
			amount: new FormControl(this.item?.amount, {
				nonNullable: true,
				validators: Validators.required,
			}),
			dateProvision: new FormControl(this.item?.requestedProvisionDate, {
				nonNullable: true,
				validators: Validators.required,
			}),
		});

		this.qualificationTrForm.controls.amount.valueChanges
			.pipe(untilDestroyed(this))
			.subscribe(value => this.item.amount = value);

		this.qualificationTrForm.controls.dateProvision.valueChanges
			.pipe(untilDestroyed(this))
			.subscribe(value => this.item.requestedProvisionDate = value);
	}

	ngAfterViewChecked() {
		if (this.content) {
			this.viewMaximise$.next(this.content.nativeElement.scrollHeight > 200);
		}
	}

	showText(text: string[], title?: string) {
		this.modalService.open(TableFullCellComponent, {
			data: {
				cell: text.map(item => {
					return { text: item };
				}),
				title,
			},
		});
	}

	protected readonly Input = Input;
	protected readonly InputType = InputType;
}
