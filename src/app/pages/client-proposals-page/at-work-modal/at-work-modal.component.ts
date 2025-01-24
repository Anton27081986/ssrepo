import { Component, Inject } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import { IClientOffersDto } from '@app/core/models/client-proposails/client-offers';
import { ModalService } from '@app/core/modal/modal.service';
import { DialogComponent } from '@app/shared/components/dialog/dialog.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ClientProposalsFacadeService } from '@app/core/facades/client-proposals-facade.service';
import { ICreateOfferItem } from '@app/core/models/client-proposails/create-offer-item';
import {CardComponent} from "@app/shared/components/card/card.component";
import {HeadlineComponent} from "@app/shared/components/typography/headline/headline.component";
import {IconComponent} from "@app/shared/components/icon/icon.component";
import {TableV2Component} from "@app/shared/components/ss-table-v2/ss-table-v2.component";
import {NgForOf} from "@angular/common";
import {
	AtWorkRowItemTrComponent
} from "@app/pages/client-proposals-page/at-work-modal/at-work-row-item-tr/at-work-row-item-tr.component";
import {ButtonComponent} from "@app/shared/components/buttons/button/button.component";

interface IOfferData {
	items: IClientOffersDto[];
	clientId: number | null;
}

@UntilDestroy()
@Component({
	selector: 'ss-at-work-modal',
	styleUrls: ['at-work-modal.component.scss'],
	templateUrl: './at-work-modal.component.html',
	imports: [
		CardComponent,
		HeadlineComponent,
		IconComponent,
		TableV2Component,
		NgForOf,
		AtWorkRowItemTrComponent,
		ButtonComponent
	],
	standalone: true
})
export class AtWorkModalComponent {
	protected items: ICreateOfferItem[] = [];
	protected clientId: number | null = null;

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
					tovSubGroupId: item.tovSubGroupId,
					tovProductName: item.newProductName,
					atWork: false,
					commentId: null,
					potencial: null,
					objective: null,
					technologistId: null,
					errors: {},
				};
			});

			this.clientId = this.data.clientId;
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

		if (invalidForm || !this.clientId) {
			return;
		}

		this.clientProposalsFacadeService
			.saveOffer({
				clientId: this.clientId,
				items: this.items.map(item => {
					return item.atWork
						? {
								tovProductId: item.tovProductId,
								tovSubGroupId: item.tovSubGroupId,
								atWork: item.atWork,
								potencial: Number(item.potencial),
								objective: Number(item.objective),
								technologistId: Number(item.technologistId),
							}
						: {
								tovProductId: item.tovProductId,
								tovSubGroupId: item.tovSubGroupId,
								atWork: item.atWork,
								commentId: Number(item.commentId),
							};
				}),
			})
			.pipe(untilDestroyed(this))
			.subscribe(() => {
				this.modalRef.close(true);
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
