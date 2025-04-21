import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	Signal,
	ViewChild,
} from '@angular/core';
import { ThankColleagueFacadeService } from '@app/core/facades/thanks-colleague-facade.service';
import { IThanksColleagueItem } from '@app/core/models/thanks-colleagues/thanks-colleague-item';
import { ModalService } from '@app/core/modal/modal.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { AddThanksColleagueModalComponent } from '@app/widgets/thank-colleague/modal/add-thanks-colleague-modal/add-thanks-colleague-modal.component';
import { CardComponent } from '@app/shared/components/card/card.component';
import { TextComponent } from '@app/shared/components/typography/text/text.component';
import { ButtonComponent } from '@app/shared/components/buttons/button/button.component';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { SsDividerComponent } from '@app/shared/components/ss-divider/ss-divider.component';
import { LoaderComponent } from '@app/shared/components/loader/loader.component';
import { ThanksColleagueCardComponent } from '@app/widgets/thank-colleague/thanks-colleague-card/thanks-colleague-card.component';
import { EmptyPlaceholderComponent } from '@app/shared/components/empty-placeholder/empty-placeholder.component';
import { HeadlineComponent } from '@app/shared/components/typography/headline/headline.component';
import { CommonModule, NgForOf, NgIf } from '@angular/common';

@Component({
	selector: 'app-thanks-colleague',
	templateUrl: './thanks-colleague.component.html',
	styleUrls: ['./thanks-colleague.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		CardComponent,
		TextComponent,
		ButtonComponent,
		IconComponent,
		SsDividerComponent,
		LoaderComponent,
		ThanksColleagueCardComponent,
		EmptyPlaceholderComponent,
		HeadlineComponent,
		NgForOf,
		NgIf,
	],
	standalone: true,
})
export class ThanksColleagueComponent {
	protected thanksList: Signal<IThanksColleagueItem[]> = toSignal(
		this.facade.thanksForColleagues$,
		{ initialValue: [] },
	);

	protected isLoading: Signal<boolean> = toSignal(this.facade.isLoading$, {
		initialValue: true,
	});

	@ViewChild('thanks')
	public thanks!: ElementRef;

	constructor(
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
