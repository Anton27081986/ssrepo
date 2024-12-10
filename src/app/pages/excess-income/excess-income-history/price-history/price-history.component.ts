import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { CardModule } from '@app/shared/components/card/card.module';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { ModalRef } from '@app/core/modal/modal.ref';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import { QueryType } from '@app/widgets/history/models/query-type';
import { ViewMode } from '@app/widgets/history/models/view-mode';
import { HistoryComponent } from '@app/widgets/history/history.component';

interface IExcessHistoryData {
	title: string;
	objectId: string;
}

@Component({
	selector: 'app-excess-income-price-history',
	standalone: true,
	imports: [CardModule, HeadlineModule, IconModule, HistoryComponent],
	templateUrl: './price-history.component.html',
	styleUrl: './price-history.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceHistoryComponent {
	private readonly modalRef = inject(ModalRef);

	protected readonly queryType = QueryType;
	protected readonly viewMode = ViewMode;
	public constructor(@Inject(DIALOG_DATA) protected readonly data: IExcessHistoryData) {}

	protected close() {
		this.modalRef.close();
	}
}
