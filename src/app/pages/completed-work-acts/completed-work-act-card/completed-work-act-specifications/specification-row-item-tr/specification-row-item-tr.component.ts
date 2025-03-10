import {
	Component,
	ElementRef,
	input,
	Input,
	InputSignal,
	OnInit,
	Signal,
	ViewChild,
} from '@angular/core';
import { ColumnsStateService } from '@app/core/columns.state.service';
import { IStoreTableBaseColumn } from '@app/core/store';
import { TooltipPosition, TooltipTheme } from '@app/shared/components/tooltip/tooltip.enums';
import { ModalService } from '@app/core/modal/modal.service';
import { ICompletedWorkActSpecification } from '@app/core/models/completed-work-acts/specification';
import { SpecificationModalComponent } from '@app/pages/completed-work-acts/completed-work-act-card/completed-work-act-specifications/add-specification-modal/specification-modal.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CompletedWorkActsFacadeService } from '@app/core/facades/completed-work-acts-facade.service';
import { DialogComponent } from '@app/shared/components/dialog/dialog.component';
import { Permissions } from '@app/core/constants/permissions.constants';
import { toSignal } from '@angular/core/rxjs-interop';

export enum SpecificationRowItemField {
	service = 'service',
	comment = 'comment',
	quantity = 'quantity',
	tovUnit = 'tovUnit',
	cost = 'cost',
	faObject = 'faObject',
	faAsset = 'faAsset',
	project = 'project',
	dept = 'dept',
	section = 'section',
	user = 'user',
	amount = 'amount',
	controls = 'controls',
}

@UntilDestroy()
@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'tr[ss-specification-row-item-tr]',
	styleUrls: ['specification-row-item-tr.component.scss'],
	templateUrl: './specification-row-item-tr.component.html',
})
export class SpecificationRowItemTrComponent implements OnInit {
	protected readonly Permissions = Permissions;
	protected readonly specificationRowItemField = SpecificationRowItemField;
	public item: InputSignal<ICompletedWorkActSpecification> =
		input.required<ICompletedWorkActSpecification>();
	public permissions: Signal<string[]> = toSignal(this.completedWorkActsFacade.permissions$, {
		initialValue: [],
	});

	@Input() defaultCols: IStoreTableBaseColumn[] = [];

	protected advantagesTpr: string[] = [];

	@ViewChild('content') public content!: ElementRef;

	constructor(
		private readonly completedWorkActsFacade: CompletedWorkActsFacadeService,
		public readonly columnsStateService: ColumnsStateService,
		private readonly modalService: ModalService,
	) {}

	ngOnInit() {
		if (this.item()) {
			this.columnsStateService.colsTr$.next([
				{
					cols: [
						{
							id: SpecificationRowItemField.service,
							title: 'Услуга',
							order: 1,
							show: true,
							colspan: 1,
							rowspan: 1,
							display: true,
						},
						{
							id: SpecificationRowItemField.comment,
							title: 'Комментарий',
							order: 2,
							show: true,
							colspan: 1,
							rowspan: 1,
							display: true,
						},
						{
							id: SpecificationRowItemField.quantity,
							title: 'Кол-во,\nед.изм',
							order: 3,
							show: true,
							colspan: 1,
							rowspan: 1,
							display: true,
						},
						{
							id: SpecificationRowItemField.cost,
							title: 'Статья',
							order: 4,
							show: true,
							colspan: 1,
							rowspan: 1,
							display: true,
						},
						{
							id: SpecificationRowItemField.faObject,
							title: 'Объект ОС/НМА, Тип ОС',
							order: 5,
							show: true,
							colspan: 1,
							rowspan: 1,
							display: true,
						},
						{
							id: SpecificationRowItemField.project,
							title: 'Проект',
							order: 6,
							show: true,
							colspan: 1,
							rowspan: 1,
							display: true,
						},
						{
							id: SpecificationRowItemField.dept,
							title: 'Отдел',
							order: 7,
							show: true,
							colspan: 1,
							rowspan: 1,
							display: true,
						},
						{
							id: SpecificationRowItemField.section,
							title: 'Производственный участок',
							order: 8,
							show: true,
							colspan: 1,
							rowspan: 1,
							display: true,
						},
						{
							id: SpecificationRowItemField.user,
							title: 'Сотрудник',
							order: 9,
							show: true,
							colspan: 1,
							rowspan: 1,
							display: true,
						},
						{
							id: SpecificationRowItemField.amount,
							title: 'Сумма 1С',
							order: 10,
							show: true,
							colspan: 1,
							rowspan: 1,
							display: true,
						},
						{
							id: SpecificationRowItemField.controls,
							title: '',
							order: 11,
							show: true,
							colspan: 1,
							rowspan: 1,
							display: true,
						},
					],
				},
			]);
		}
	}

	public onEditSpecification(spec: ICompletedWorkActSpecification) {
		this.modalService.open(SpecificationModalComponent, { data: spec });
	}

	protected readonly TooltipTheme = TooltipTheme;
	protected readonly TooltipPosition = TooltipPosition;

	protected onDeleteSpecification(id: number): void {
		this.modalService
			.open(DialogComponent, {
				data: {
					header: 'Запись будет безвозвратно удалена',
					text: 'Вы уверены, что хотите совершить действие?',
				},
			})
			.afterClosed()
			.pipe(untilDestroyed(this))
			.subscribe(status => {
				if (status) {
					this.completedWorkActsFacade.deleteSpecification(id);
				}
			});
	}
}
