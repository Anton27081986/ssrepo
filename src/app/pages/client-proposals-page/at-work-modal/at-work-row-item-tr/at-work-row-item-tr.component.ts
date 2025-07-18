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

export enum AtWorkRowItemField {
	tovProductName = 'tovProductName',
	atWork = 'atWork',
	commentId = 'commentId',
	potencial = 'potencial',
	objective = 'objective',
	technologistId = 'technologistId',
}

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'tr[ss-at-work-row-item-tr]',
	styleUrls: ['at-work-row-item-tr.component.scss'],
	templateUrl: './at-work-row-item-tr.component.html',
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
	],
	standalone: true,
})
export class AtWorkRowItemTrComponent implements OnInit, AfterViewChecked {
	protected readonly AtWorkRowItemField = AtWorkRowItemField;
	protected tprRejectsReasons$: Observable<IDictionaryItemDto[]>;

	@Input({ required: true })
	item!: {
		tovProductId: number;
		tovSubGroupId: number;
		tovProductName: string;
		atWork: boolean;
		commentId: null | string;
		potencial: null | string;
		objective: null | string;
		technologistId: null | string;
		errors: {
			commentId?: boolean;
			potencial?: boolean;
			objective?: boolean;
			technologistId?: boolean;
		};
	};

	@Input()
	defaultCols: IStoreTableBaseColumn[] = [];

	protected viewMaximise$: BehaviorSubject<boolean> =
		new BehaviorSubject<boolean>(false);

	@ViewChild('content')
	public content!: ElementRef;

	@Output()
	checkForm: EventEmitter<boolean> = new EventEmitter<boolean>();

	protected readonly TooltipTheme = TooltipTheme;
	protected readonly TooltipPosition = TooltipPosition;
	constructor(
		public readonly columnsStateService: ColumnsStateService,
		private readonly clientProposalsFacadeService: ClientProposalsFacadeService,
		private readonly modalService: ModalService
	) {
		this.tprRejectsReasons$ =
			this.clientProposalsFacadeService.tprRejectsReasons$;
	}

	ngOnInit() {
		this.columnsStateService.colsTr$.next([
			{
				cols: [
					{
						id: AtWorkRowItemField.tovProductName,
						title: 'ТПР',
						order: 1,
						show: true,
						colspan: 1,
						rowspan: 1,
						display: true,
					},
					{
						id: AtWorkRowItemField.atWork,
						title: 'В работе',
						order: 2,
						show: true,
						width: '12%',
						colspan: 1,
						rowspan: 1,
						display: true,
					},
					{
						id: AtWorkRowItemField.commentId,
						title: 'Комментарий',
						order: 3,
						show: true,
						width: '16%',
						colspan: 1,
						rowspan: 1,
						display: true,
					},
					{
						id: AtWorkRowItemField.potencial,
						title: 'Потенциал, кг',
						order: 4,
						show: true,
						width: '16%',
						colspan: 1,
						rowspan: 1,
						display: true,
					},
					{
						id: AtWorkRowItemField.objective,
						title: 'Задача, кг',
						order: 5,
						show: true,
						width: '16%',
						colspan: 1,
						rowspan: 1,
						display: true,
					},
					{
						id: AtWorkRowItemField.technologistId,
						title: 'Технолог',
						order: 6,
						show: true,
						width: '16%',
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
			this.viewMaximise$.next(
				this.content.nativeElement.scrollHeight > 200
			);
		}
	}

	onCheckAtWork(target: EventTarget) {
		this.item.atWork = (target as HTMLInputElement).checked;
	}

	getInputValue(target: EventTarget) {
		return (target as HTMLInputElement).value;
	}

	showText(text: string[], title?: string) {
		this.modalService.open(TableFullCellComponent, {
			data: {
				cell: text.map((item) => {
					return { text: item };
				}),
				title,
			},
		});
	}
}
