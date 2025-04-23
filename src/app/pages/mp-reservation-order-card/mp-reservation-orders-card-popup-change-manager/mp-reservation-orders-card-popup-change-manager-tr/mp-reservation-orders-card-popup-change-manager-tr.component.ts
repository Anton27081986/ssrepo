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
import {AsyncPipe, CommonModule, NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";
import {TextComponent} from "@app/shared/components/typography/text/text.component";
import {SelectComponent} from "@app/shared/components/select/select.component";
import {InputComponent} from "@app/shared/components/inputs/input/input.component";
import {SearchInputComponent} from "@app/shared/components/inputs/search-input/search-input.component";
import {DateTimePickerComponent} from "@app/shared/components/inputs/date-time-picker/date-time-picker.component";
import {
	IReservationOrderChangeProvisionDetails
} from "@app/core/models/mp-reservation-orders/mp-reservation-order-change-provision-details";

export enum ChangeProvisionDetailsTrRowItemField {
	manufacturingAmount = 'manufacturingAmount',
	productionDate = 'productionDate',
	provisionDate = 'provisionDate',
}

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'tr[mp-reservation-orders-card-popup-change-manager-tr]',
	styleUrls: ['mp-reservation-orders-card-popup-change-manager-tr.component.scss'],
	templateUrl: './mp-reservation-orders-card-popup-change-manager-tr.component.html',
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
		DateTimePickerComponent
	],
	standalone: true
})
export class MpReservationOrdersCardPopupChangeManagerTrComponent implements OnInit, AfterViewChecked {
	protected readonly ChangeProvisionDetailsTrRowItemField = ChangeProvisionDetailsTrRowItemField;
	protected tprRejectsReasons$: Observable<IDictionaryItemDto[]>;

	@Input({ required: true }) item!: IReservationOrderChangeProvisionDetails;

	@Input() defaultCols: IStoreTableBaseColumn[] = [];

	protected viewMaximise$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	@ViewChild('content') public content!: ElementRef;

	@Output() checkForm: EventEmitter<boolean> = new EventEmitter<boolean>();

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
						id: ChangeProvisionDetailsTrRowItemField.manufacturingAmount,
						title: 'Кол-во в производстве',
						order: 1,
						show: true,
						colspan: 1,
						rowspan: 1,
						display: true,
					},
					{
						id: ChangeProvisionDetailsTrRowItemField.productionDate,
						title: 'Дата производства',
						order: 2,
						show: true,
						colspan: 1,
						rowspan: 1,
						display: true,
					},
					{
						id: ChangeProvisionDetailsTrRowItemField.provisionDate,
						title: 'Дата обеспечения',
						order: 3,
						show: true,
						colspan: 1,
						rowspan: 1,
						display: true,
					},
				],
			},
		]);
	}

	ngAfterViewChecked() {
		if (this.content) {
			this.viewMaximise$.next(this.content.nativeElement.scrollHeight > 200);
		}
	}

	getInputValue(target: EventTarget) {
		return (target as HTMLInputElement).value;
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

	protected readonly TooltipTheme = TooltipTheme;
	protected readonly TooltipPosition = TooltipPosition;
	protected readonly Number = Number;
}
