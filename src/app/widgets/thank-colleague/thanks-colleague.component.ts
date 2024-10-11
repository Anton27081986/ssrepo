import { ChangeDetectionStrategy, Component, ElementRef, Signal, ViewChild } from '@angular/core';
import { ThankColleagueFacadeService } from '@app/core/facades/thanks-colleague-facade.service';
import { IThanksColleagueItem } from '@app/core/models/thanks-colleagues/thanks-colleague-item';
import { ModalService } from '@app/core/modal/modal.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { AddThanksColleagueModalComponent } from '@app/widgets/thank-colleague/modal/add-thanks-colleague-modal/add-thanks-colleague-modal.component';

@Component({
	selector: 'app-thanks-colleague',
	templateUrl: './thanks-colleague.component.html',
	styleUrls: ['./thanks-colleague.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThanksColleagueComponent {
	protected thanksList: Signal<IThanksColleagueItem[]> = toSignal(
		this.facade.thanksForColleagues$,
		{ initialValue: [] },
	);

	@ViewChild('thanks') public thanks!: ElementRef;

	public constructor(
		protected readonly facade: ThankColleagueFacadeService,
		private readonly modalService: ModalService,
	) {}

	protected openAddThanks() {
		this.modalService.open(AddThanksColleagueModalComponent, { data: {} });
	}

	protected loadMoreThanks() {
		if (
			this.thanks.nativeElement.scrollHeight -
				this.thanks.nativeElement.offsetHeight -
				this.thanks.nativeElement.scrollTop <
			200
		) {
			this.facade.loadMoreThanksForColleagues();
		}
	}
}
