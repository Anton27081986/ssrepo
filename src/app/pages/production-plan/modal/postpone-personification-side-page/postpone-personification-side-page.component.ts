import {
	ChangeDetectionStrategy,
	Component,
	inject,
	Signal,
} from '@angular/core';
import {
	Align,
	ButtonComponent,
	ButtonType,
	Colors,
	ExtraSize,
	IconComponent,
	IconType,
	ModalRef,
	RightSidePagePopupComponent,
	Shape,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-library/components';
import { OperationPlanService } from '@app/pages/production-plan/service/operation-plan.service';
import { TransferProductionPlanMap } from '@app/core/models/production-plan/transfer-production-plan-from-backend';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgFor, NgIf } from '@angular/common';
import { IResponse } from '@app/core/utils/response';
import { tap } from 'rxjs';
import { PostponePersonificationTableComponent } from '@app/pages/production-plan/modal/postpone-personification-table/postpone-personification-table.component';

export interface PostponeSidePageData {
	id: number;
}

@Component({
	selector: 'app-postpone-side-page',
	standalone: true,
	imports: [
		RightSidePagePopupComponent,
		NgIf,
		TextComponent,
		ButtonComponent,
		PostponePersonificationTableComponent,
		IconComponent,
	],
	templateUrl: './postpone-personification-side-page.component.html',
	styleUrl: './postpone-personification-side-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostponePersonificationSidePageComponent {
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly IconType = IconType;
	protected readonly ExtraSize = ExtraSize;
	protected readonly Shape = Shape;
	protected readonly ButtonType = ButtonType;
	protected readonly Colors = Colors;
	protected readonly Align = Align;

	private readonly popup: ModalRef<PostponeSidePageData> = inject(
		ModalRef<PostponeSidePageData>,
	);
	private readonly service: OperationPlanService =
		inject(OperationPlanService);

	protected readonly personificationRes: Signal<IResponse<TransferProductionPlanMap> | null> =
		toSignal(this.service.getTransferProductionPlan(this.popup.data.id), {
			initialValue: null,
		});

	protected get totalQuantityForTransferCalc(): number | null {
		const personificationRes = this.personificationRes();
		if (personificationRes) {
			return personificationRes.items.reduce((sum, item) => {
				return sum + Number(item.countForPostpone.value!);
			}, 0)!;
		}

		return null;
	}

	protected get totalQuantityCalc(): number | null {
		const personificationRes = this.personificationRes();
		if (personificationRes) {
			return personificationRes.items.reduce(
				(sum, item) => sum + item.quantity,
				0,
			);
		}
		return null;
	}

	protected get totalForButtonTransfer(): string {
		return `Перенести ${this.totalQuantityForTransferCalc} едениц`;
	}

	protected close() {
		this.popup.close();
	}

	protected transferProductionPlan() {
		const personificationRes = this.personificationRes();
		if (
			personificationRes?.items.some(
				(item) =>
					item.countForPostpone.invalid ||
					item.productionDateControl.invalid,
			)
		) {
			return;
		}

		const changedItems = personificationRes?.items.filter(
			(item) =>
				item.countForPostpone.dirty || item.productionDateControl.dirty,
		);

		if (changedItems?.length === 0) {
			return;
		}

		if (personificationRes) {
			this.service
				.transferProductionPlan(changedItems!)
				.pipe(
					tap(() => {
						this.close();
					}),
				)
				.subscribe();
		}
	}
}
