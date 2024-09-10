import { Component, Inject } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import { IClientOffersDto } from '@app/core/models/client-proposails/client-offers';
import { ModalService } from '@app/core/modal/modal.service';
import { DialogComponent } from '@app/shared/components/dialog/dialog.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

interface OfferData {
	clientOffersId: string;
	items: IClientOffersDto[];
}

@UntilDestroy()
@Component({
	selector: 'ss-at-work-modal',
	styleUrls: ['at-work-modal.component.scss'],
	templateUrl: './at-work-modal.component.html',
})
export class AtWorkModalComponent {
	protected clientOffersId: string = '';
	protected items: Array<{
		tovProductId: number;
		tovProductName: string;
		atWork: boolean;
		commentId: null | string;
		potencial: null | string;
		objective: null | string;
		technologistId: null | string;
		errors: {
			commentId?: boolean;
			potencial?: boolean;
			objective?: boolean;
			technologistId?: boolean;
		};
	}> = [];

	constructor(
		private readonly modalService: ModalService,
		private readonly modalRef: ModalRef,
		@Inject(DIALOG_DATA) private readonly data: OfferData,
	) {
		if (data) {
			this.clientOffersId = this.data.clientOffersId;
			this.items = this.data.items.map(item => {
				return {
					tovProductId: item.tovProductionId,
					tovProductName: item.newProductName,
					atWork: false,
					commentId: null,
					potencial: null,
					objective: null,
					technologistId: null,
					errors: {},
				};
			});
		}
	}

	protected createTask() {
		let invalidForm: boolean | undefined;

		this.items.forEach(item => {
			if (item.atWork) {
				item.errors.potencial = !item.potencial;
				item.errors.objective = !item.objective;
			} else {
				item.errors.commentId = !item.commentId;
			}

			invalidForm = item.errors.potencial || item.errors.objective || item.errors.commentId;
		});

		if (invalidForm) {
			return;
		}

		console.log(this.items);
	}

	protected close() {
		this.modalService
			.open(DialogComponent, {
				data: {
					header: 'Данные будут не сохранены',
					text: 'Вы уверены, что хотите уйти?',
				},
			})
			.afterClosed()
			.pipe(untilDestroyed(this))
			.subscribe(status => {
				if (status) {
					this.modalRef.close();
				}
			});
	}
}
