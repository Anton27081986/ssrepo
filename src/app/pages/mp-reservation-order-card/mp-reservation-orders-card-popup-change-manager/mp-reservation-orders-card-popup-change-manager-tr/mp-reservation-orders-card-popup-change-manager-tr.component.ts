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
import {
	TooltipPosition,
	TooltipTheme,
} from '@app/shared/components/tooltip/tooltip.enums';
import { BehaviorSubject, Observable } from 'rxjs';
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
import { IReservationOrderChangeProvisionDetails } from '@app/core/models/mp-reservation-orders/mp-reservation-order-change-provision-details';

export enum ChangeProvisionDetailsTrRowItemField {
	manufacturingAmount = 'manufacturingAmount',
	productionDate = 'productionDate',
	provisionDate = 'provisionDate',
}

@Component({
	selector: 'tr[mp-reservation-orders-card-popup-change-manager-tr]',
	styleUrls: [
		'mp-reservation-orders-card-popup-change-manager-tr.component.scss',
	],
	templateUrl:
		'./mp-reservation-orders-card-popup-change-manager-tr.component.html',
	imports: [
		CommonModule,
		NgForOf,
		AsyncPipe,
		NgSwitch,
		NgIf,
		NgSwitchCase,
		NgSwitchDefault,
	],
	standalone: true,
})
export class MpReservationOrdersCardPopupChangeManagerTrComponent
	implements OnInit, AfterViewChecked
{
	protected readonly ChangeProvisionDetailsTrRowItemField =
		ChangeProvisionDetailsTrRowItemField;

	protected tprRejectsReasons$: Observable<IDictionaryItemDto[]>;

	@Input({ required: true })
	public item!: IReservationOrderChangeProvisionDetails;

	@Input()
	public defaultCols: IStoreTableBaseColumn[] = [];

	protected viewMaximise$: BehaviorSubject<boolean> =
		new BehaviorSubject<boolean>(false);

	@ViewChild('content')
	public content!: ElementRef;

	@Output()
	public checkForm: EventEmitter<boolean> = new EventEmitter<boolean>();

	protected readonly TooltipTheme = TooltipTheme;
	protected readonly TooltipPosition = TooltipPosition;
	protected readonly Number = Number;
	constructor(
		public readonly columnsStateService: ColumnsStateService,
		private readonly clientProposalsFacadeService: ClientProposalsFacadeService
	) {
		this.tprRejectsReasons$ =
			this.clientProposalsFacadeService.tprRejectsReasons$;
	}

	public ngOnInit(): void {
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

	public ngAfterViewChecked(): void {
		if (this.content) {
			this.viewMaximise$.next(
				this.content.nativeElement.scrollHeight > 200
			);
		}
	}

	// public getInputValue(target: EventTarget): string {
	// 	return (target as HTMLInputElement).value;
	// }
	//
	// public showText(text: string[], title?: string): void {
	// 	this.modalService.open(TableFullCellComponent, {
	// 		data: {
	// 			cell: text.map((item) => {
	// 				return { text: item };
	// 			}),
	// 			title,
	// 		},
	// 	});
	// }
}
