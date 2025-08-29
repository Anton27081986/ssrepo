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
} from '@angular/common';
import { IApproveChangeRow } from '@app/core/models/mp-reservation-orders/mp-reservation-order-change-provision-details';
import {
	TextComponent,
	TextType,
	TextWeight,
} from '@front-components/components';

export enum ChangeProvisionDetailsTrRowItemField {
	oldDate = 'oldDate',
	newDate = 'newDate',
	oldAmount = 'oldAmount',
	newAmount = 'newAmount',
}

@Component({
	selector: 'tr[mp-reservation-orders-card-popup-approve-details-change-tr]',
	styleUrls: [
		'mp-reservation-orders-card-popup-approve-details-change-tr.component.scss',
	],
	templateUrl:
		'./mp-reservation-orders-card-popup-approve-details-change-tr.component.html',
	imports: [
		CommonModule,
		NgForOf,
		AsyncPipe,
		NgSwitch,
		NgIf,
		NgSwitchCase,
		TextComponent,
	],
	standalone: true,
})
export class MpReservationOrdersCardPopupApproveDetailsChangeTrComponent
	implements OnInit, AfterViewChecked
{
	@Input({ required: true })
	public item!: IApproveChangeRow;

	@Input()
	public defaultCols: IStoreTableBaseColumn[] = [];

	@ViewChild('content')
	public content!: ElementRef;

	@Output()
	public checkForm: EventEmitter<boolean> = new EventEmitter<boolean>();

	protected readonly TooltipTheme = TooltipTheme;
	protected readonly TooltipPosition = TooltipPosition;
	protected readonly TextWeight = TextWeight;
	protected readonly TextType = TextType;
	protected readonly Number = Number;

	// protected readonly ChangeProvisionDetailsTrRowItemField =
	// 	ChangeProvisionDetailsTrRowItemField;

	protected tprRejectsReasons$: Observable<IDictionaryItemDto[]>;
	protected viewMaximise$: BehaviorSubject<boolean> =
		new BehaviorSubject<boolean>(false);

	constructor(
		public readonly columnsStateService: ColumnsStateService,
		private readonly clientProposalsFacadeService: ClientProposalsFacadeService
		// private readonly modalService: ModalService,
	) {
		this.tprRejectsReasons$ =
			this.clientProposalsFacadeService.tprRejectsReasons$;
	}

	public ngOnInit(): void {
		this.columnsStateService.colsTr$.next([
			{
				cols: [
					{
						id: ChangeProvisionDetailsTrRowItemField.oldDate,
						title: 'Желаемая дата (старое значение)',
						order: 1,
						show: true,
						colspan: 1,
						rowspan: 1,
						display: true,
					},
					{
						id: ChangeProvisionDetailsTrRowItemField.newDate,
						title: 'Желаемая дата(новое значение)',
						order: 2,
						show: true,
						colspan: 1,
						rowspan: 1,
						display: true,
					},
					{
						id: ChangeProvisionDetailsTrRowItemField.oldAmount,
						title: 'Количество (старое значение)',
						order: 3,
						show: true,
						colspan: 1,
						rowspan: 1,
						display: true,
					},
					{
						id: ChangeProvisionDetailsTrRowItemField.newAmount,
						title: 'Количество (новое значение)',
						order: 4,
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

	// getInputValue(target: EventTarget): string {
	// 	return (target as HTMLInputElement).value;
	// }
	//
	// showText(text: string[], title?: string) {
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
