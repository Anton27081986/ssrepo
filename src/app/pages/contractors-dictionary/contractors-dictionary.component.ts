import { ChangeDetectionStrategy, Component } from '@angular/core';
import {ButtonComponent, ButtonType, ExtraSize, IconType} from "@front-library/components";
import {
	ContractorsDictionaryPopupService
} from "@app/pages/contractors-dictionary/services/contactors-dictionary.popup.service";
import {IconPosition} from "@front-components/components";
import {RouterOutlet} from "@angular/router";

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

	constructor(private contractorsDictionaryPopupService: ContractorsDictionaryPopupService) {}

	onCreateCounterparty(): void {
		this.contractorsDictionaryPopupService.openCreateContractorsCardModal('TEST  MODAL');

	}

}
