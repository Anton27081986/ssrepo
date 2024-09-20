import { Component, Inject } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import { IClientOffersDto } from '@app/core/models/client-proposails/client-offers';
import { ModalService } from '@app/core/modal/modal.service';
import { DialogComponent } from '@app/shared/components/dialog/dialog.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
	ClientProposalsFacadeService,
	filterTruthy,
} from '@app/core/facades/client-proposals-facade.service';
import { ICreateOfferItem } from '@app/core/models/client-proposails/create-offer-item';
import { tap } from 'rxjs';
import { switchMap } from 'rxjs/operators';

interface IOfferData {
	items: IClientOffersDto[];
}

@UntilDestroy()
@Component({
	selector: 'ss-at-work-modal',
	styleUrls: ['at-work-modal.component.scss'],
	templateUrl: './at-work-modal.component.html',
})
export class AtWorkModalComponent {
	protected items: ICreateOfferItem[] = [];

	constructor(
		private readonly modalService: ModalService,
		private readonly modalRef: ModalRef,
		private readonly clientProposalsFacadeService: ClientProposalsFacadeService,
		@Inject(DIALOG_DATA) private readonly data: IOfferData,
	) {
		if (data) {
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
				item.errors.technologistId = !item.technologistId;
			} else {
				item.errors.commentId = !item.commentId;
			}

			invalidForm =
				invalidForm ||
				item.errors.potencial ||
				item.errors.objective ||
				item.errors.commentId ||
				item.errors.technologistId;
		});

		if (invalidForm) {
			return;
		}

		this.clientProposalsFacadeService.clientId$
			.pipe(
				filterTruthy(),
				switchMap(clientId => {
					return this.clientProposalsFacadeService.saveOffer({
						clientId,
						items: this.items,
					});
				}),
				untilDestroyed(this),
			)
			.subscribe(() => {
				this.clientProposalsFacadeService.blockForProposalSubject$.next(false);
				this.modalRef.close();
			});
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
