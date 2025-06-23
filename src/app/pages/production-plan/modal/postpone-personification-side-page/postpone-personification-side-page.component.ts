import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	OnInit,
	Signal,
} from '@angular/core';
import {
	ButtonComponent,
	ColumnsStateService,
	ExtraSize,
	IconType,
	IStoreTableBaseColumn,
	ModalRef,
	RightSidePagePopupComponent,
	Shape,
	TableComponent,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-library/components';
import { OperationPlanService } from '@app/pages/production-plan/service/operation-plan.service';
import { TransferProductionPlanMap } from '@app/core/models/operation-plan/transfer-production-plan-from-backend';
import { toSignal } from '@angular/core/rxjs-interop';
import {
	PostponePersonificationRowItemField,
	PostponePersonificationRowTrComponent,
} from '@app/pages/production-plan/modal/postpone-personification-tr/postpone-personification-row-tr.component';
import { NgFor, NgIf } from '@angular/common';
import { IResponse } from '@app/core/utils/response';
import { tap } from 'rxjs';

export interface PostponeSidePageData {
	id: number;
}

@Component({
	selector: 'app-postpone-side-page',
	standalone: true,
	imports: [
		RightSidePagePopupComponent,
		TableComponent,
		PostponePersonificationRowTrComponent,
		NgFor,
		NgIf,
		TextComponent,
		ButtonComponent,
	],
	templateUrl: './postpone-personification-side-page.component.html',
	styleUrl: './postpone-personification-side-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [ColumnsStateService],
})
export class PostponePersonificationSidePageComponent implements OnInit {
	private readonly popup: ModalRef<PostponeSidePageData> = inject(
		ModalRef<PostponeSidePageData>,
	);
	private readonly service: OperationPlanService =
		inject(OperationPlanService);

	private readonly stateColumn: ColumnsStateService =
		inject(ColumnsStateService);

	protected readonly personificationRes: Signal<IResponse<TransferProductionPlanMap> | null> =
		toSignal(this.service.getTransferProductionPlan(this.popup.data.id), {
			initialValue: null,
		});

	protected get totalQuantityCalc(): number | null {
		const personificationRes = this.personificationRes();
		if (personificationRes) {
			return personificationRes.items.reduce((sum, item) => {
				return sum + Number(item.countForPostpone.value!);
			}, 0)!;
		}

		return null;
	}

	ngOnInit() {
		this.stateColumn.colsTr$.next(POSTPONE_PERSONIFICATION_COLUMNS_CONFIG);
	}

	protected close() {
		this.popup.close();
	}

	protected transferProductionPlan() {
		const personificationRes = this.personificationRes();
		if (personificationRes) {
			toSignal(
				this.service
					.transferProductionPlan(personificationRes.items)
					.pipe(
						tap(() => {
							this.close();
						}),
					),
			);
		}
	}

	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly IconType = IconType;
	protected readonly ExtraSize = ExtraSize;
	protected readonly Shape = Shape;
}

export const POSTPONE_PERSONIFICATION_COLUMNS_CONFIG: IStoreTableBaseColumn[] =
	[
		{
			id: PostponePersonificationRowItemField.orderNumber,
			title: 'Номер заказа',
			order: 0,
			width: '40px',
			align: 'center',
			noPadding: true,
			sticky: false,
			skeleton: {
				header: {
					width: '20px',
					height: '20px',
					type: Shape.Round,
				},
				body: {
					width: '20px',
					height: '20px',
					type: Shape.Round,
				},
			},
		},
		{
			id: PostponePersonificationRowItemField.customer,
			title: 'Заказчик',
			order: 1,
			width: '40px',
			align: 'center',
			noPadding: true,
			sticky: false,
			skeleton: {
				header: {
					width: '20px',
					height: '20px',
					type: Shape.Round,
				},
				body: {
					width: '20px',
					height: '20px',
					type: Shape.Round,
				},
			},
		},
		{
			id: PostponePersonificationRowItemField.count,
			title: 'Количество',
			order: 2,
			width: '40px',
			align: 'center',
			noPadding: true,
			sticky: false,
			skeleton: {
				header: {
					width: '20px',
					height: '20px',
					type: Shape.Round,
				},
				body: {
					width: '20px',
					height: '20px',
					type: Shape.Round,
				},
			},
		},
		{
			id: PostponePersonificationRowItemField.countForPostpone,
			title: 'Кол-во для переноса',
			order: 3,
			width: '40px',
			align: 'center',
			noPadding: true,
			sticky: false,
			skeleton: {
				header: {
					width: '20px',
					height: '20px',
					type: Shape.Round,
				},
				body: {
					width: '20px',
					height: '20px',
					type: Shape.Round,
				},
			},
		},
		{
			id: PostponePersonificationRowItemField.postponeForData,
			title: 'Перенести на дату',
			order: 4,
			width: '40px',
			align: 'center',
			noPadding: true,
			sticky: false,
			skeleton: {
				header: {
					width: '20px',
					height: '20px',
					type: Shape.Round,
				},
				body: {
					width: '20px',
					height: '20px',
					type: Shape.Round,
				},
			},
		},
	];
