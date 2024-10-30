import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { CardModule } from '@app/shared/components/card/card.module';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { ModalRef } from '@app/core/modal/modal.ref';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import { QueryType } from '@app/widgets/history/models/query-type';
import { ViewMode } from '@app/widgets/history/models/view-mode';
import { HistoryComponent } from '@app/widgets/history/history.component';

@Component({
	selector: 'app-completed-work-act-history',
	standalone: true,
	imports: [CardModule, HeadlineModule, IconModule, HistoryComponent],
	templateUrl: './completed-work-act-history.component.html',
	styleUrl: './completed-work-act-history.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompletedWorkActHistoryComponent {
	private readonly modalRef = inject(ModalRef);

	protected readonly queryType = QueryType;
	protected readonly viewMode = ViewMode;
	public constructor(@Inject(DIALOG_DATA) protected readonly actId: number) {}

	protected close() {
		this.modalRef.close();
	}
}
