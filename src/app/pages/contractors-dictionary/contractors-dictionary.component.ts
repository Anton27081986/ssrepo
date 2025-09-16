import { ContractorsDictionaryPopupService } from '@app/pages/contractors-dictionary/services/contactors-dictionary.popup.service';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContractorCardDialogComponent } from '@app/pages/contractors-dictionary/contractor-card-dialog/contractor-card-dialog.component';
import {
	ButtonComponent,
	ButtonType,
	ModalRef,
	SharedPopupService,
	ExtraSize,
	IconType,
	IconPosition,
} from '@front-library/components';
import { IContractorCardSidePageData } from '@app/pages/contractors-dictionary/models/contractor-card-side-page-data';

@Component({
	selector: 'contractors-dictionary',
	templateUrl: './contractors-dictionary.component.html',
	styleUrls: ['./contractors-dictionary.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [ButtonComponent, RouterOutlet],
})
export class ContractorsDictionaryComponent {
	protected readonly ButtonType = ButtonType;
	protected readonly IconType = IconType;
	protected readonly IconPosition = IconPosition;
	protected readonly ExtraSize = ExtraSize;

	private readonly popup = inject(SharedPopupService);

	constructor(
		private contractorsDictionaryPopupService: ContractorsDictionaryPopupService
	) {}

	onCreateCounterparty(): void {
		this.contractorsDictionaryPopupService.openCreateContractorsCardModal();
	}

	public contractorCardDialog(): ModalRef {
		return this.popup.openRightSidePage<IContractorCardSidePageData>(
			ContractorCardDialogComponent,
			{ id: 1235 },
			'820px',
			false
		);
	}
}
