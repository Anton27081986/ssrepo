import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContractorCardDialogComponent } from '@app/pages/contractors-dictionary/contractor-card-dialog/contractor-card-dialog.component';
import {
	ButtonComponent,
	ButtonType,
	ModalRef,
	SharedPopupService,
} from '@front-library/components';
import { IContractorCardSidePageData } from '@app/pages/contractors-dictionary/models/contractor-card-side-page-data';

@Component({
	selector: 'contractors-dictionary',
	templateUrl: './contractors-dictionary.component.html',
	styleUrls: ['./contractors-dictionary.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [RouterOutlet, ButtonComponent],
})
export class ContractorsDictionaryComponent {
	private readonly popup = inject(SharedPopupService);

	protected readonly ButtonType = ButtonType;

	public contractorCardDialog(): ModalRef {
		return this.popup.openRightSidePage<IContractorCardSidePageData>(
			ContractorCardDialogComponent,
			{ id: 1 },
			'820px',
			false
		);
	}
}
