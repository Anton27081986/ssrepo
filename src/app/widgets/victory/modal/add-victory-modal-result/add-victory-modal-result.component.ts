import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ModalRef } from '@app/core/modal/modal.ref';
import { HeadlineComponent } from '@app/shared/components/typography/headline/headline.component';
import { SsDividerComponent } from '@app/shared/components/ss-divider/ss-divider.component';
import { TextComponent } from '@app/shared/components/typography/text/text.component';

@UntilDestroy()
@Component({
	selector: 'app-add-victory-modal-result',
	templateUrl: './add-victory-modal-result.component.html',
	styleUrls: ['./add-victory-modal-result.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [HeadlineComponent, SsDividerComponent, TextComponent],
	standalone: true,
})
export class AddVictoryModalResultComponent {
	constructor(private readonly modalRef: ModalRef) {}

	protected close() {
		this.modalRef.close();
	}
}
