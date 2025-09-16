import { ContractorCardDialogComponent } from '@app/pages/contractors-dictionary/contractor-card-dialog/contractor-card-dialog.component';
import {
	ButtonComponent,
	ButtonType,
	ModalRef,
	SharedPopupService,
} from '@front-library/components';
import { IContractorCardSidePageData } from '@app/pages/contractors-dictionary/models/contractor-card-side-page-data';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-contractors-dictionary',
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
