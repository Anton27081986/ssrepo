import {
	ChangeDetectionStrategy,
	Component,
	inject,
	Signal,
} from '@angular/core';
import {
	Align,
	ButtonType,
	Colors,
	ExtraSize,
	IconComponent,
	IconPosition,
	IconType,
	LinkAppearance,
	LinkComponent,
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
import { NgIf } from '@angular/common';
import { IResponse } from '@app/core/utils/response';
import { PostponePersonificationTableComponent } from '@app/pages/production-plan/modal/postpone-personification-table/postpone-personification-table.component';

export interface PostponeSidePageData {
	id: number;
	date: string;
}

@Component({
	selector: 'app-postpone-side-page',
	standalone: true,
	imports: [
		RightSidePagePopupComponent,
		NgIf,
		PostponePersonificationTableComponent,
		TextComponent,
		TextComponent,
		IconComponent,
		LinkComponent,
	],
	templateUrl: './postpone-personification-side-page.component.html',
	styleUrl: './postpone-personification-side-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostponePersonificationSidePageComponent {
	protected readonly TextWeight = TextWeight;
	protected readonly TextType = TextType;
	protected readonly IconType = IconType;
	protected readonly ExtraSize = ExtraSize;
	protected readonly Shape = Shape;
	protected readonly ButtonType = ButtonType;
	protected readonly Colors = Colors;
	protected readonly Align = Align;
	protected readonly IconPosition = IconPosition;
	protected readonly LinkAppearance = LinkAppearance;

	private readonly popup: ModalRef<PostponeSidePageData> = inject(
		ModalRef<PostponeSidePageData>
	);

	private readonly service: OperationPlanService =
		inject(OperationPlanService);

	protected readonly personificationRes: Signal<IResponse<TransferProductionPlanMap> | null> =
		toSignal(this.service.getTransferProductionPlan(this.popup.data.id), {
			initialValue: null,
		});

	protected get headerTextAndDate(): string {
		const currentDate = this.popup.data.date;

		if (!currentDate) {
			return 'Заказ';
		}

		const [yyyy, mm, dd] = currentDate.slice(0, 10).split('-');

		return `Заказ на ${dd}.${mm}.${yyyy}`;
	}

	protected get tovName(): string {
		const resp = this.personificationRes();

		if (!resp || resp.items.length === 0) {
			return '';
		}

		return resp.tov?.name || '';
	}

	protected get linkToDetailTov(): string {
		const resp = this.personificationRes();

		if (!resp || resp.items.length === 0) {
			return '';
		}

		return resp.linkToModule;
	}

	protected get totalQuantityCalc(): number | null {
		const personificationRes = this.personificationRes();

		if (personificationRes) {
			return personificationRes.items.reduce(
				(sum, item) => sum + item.quantity,
				0
			);
		}

		return null;
	}

	protected openCard(): void {
		window.open(this.linkToDetailTov, '_blank');
	}

	protected close(): void {
		this.popup.close();
	}
}
