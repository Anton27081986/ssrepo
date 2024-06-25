import { UntilDestroy } from '@ngneat/until-destroy';
import { Component } from '@angular/core';
import { IFilterOption } from '@app/shared/components/filters/filters.component';
import { ClientProposalsSendCloudPopoverComponent } from '@app/pages/client-proposals-page/client-proposals-send-cloud-popover/client-proposals-send-cloud-popover.component';
import { ModalService } from '@app/core/modal/modal.service';

@UntilDestroy()
@Component({
	selector: 'app-client-proposals-table-vgp',
	templateUrl: './client-proposals-table-vgp.component.html',
	styleUrls: ['./client-proposals-table-vgp.component.scss'],
})
export class ClientProposalsTableVgpComponent {
	protected vgp: IFilterOption[] = [];

	protected optionsVgp: IFilterOption[] = [
		// заглушка
		{
			id: 1,
			name: 'example-vgp-1',
		},
		{
			id: 2,
			name: 'example-vgp-2',
		},
	];

	constructor(private readonly modalService: ModalService) {}

	protected getSelected(event: IFilterOption[]) {
		if (event) {
			this.vgp = event;
		}
	}

	protected openPopoverSendToTheCloud() {
		this.modalService.open(ClientProposalsSendCloudPopoverComponent, {});
	}
}
