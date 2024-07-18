import { Component, Input, OnInit } from '@angular/core';
import { ColumnsStateService } from '@app/core/columns.state.service';
import {
	IClientOffersDto,
	IFilesProposals,
} from '@app/core/models/client-proposails/client-offers';
import { IStoreTableBaseColumn } from '@app/core/store';
import { TooltipPosition, TooltipTheme } from '@app/shared/components/tooltip/tooltip.enums';
import { CheckFileListStateService } from '@app/pages/client-proposals-page/client-proposals-table-vgp/check-file-list-state.service';
import { BehaviorSubject } from 'rxjs';
import { ClientProposalsSendCloudPopoverComponent } from '@app/pages/client-proposals-page/client-proposals-send-cloud-popover/client-proposals-send-cloud-popover.component';
import { ModalService } from '@app/core/modal/modal.service';
import { ClientProposalsViewFilesPopoverComponent } from '@app/pages/client-proposals-page/client-proposals-view-files-popover/client-proposals-view-files-popover.component';

export enum ClientProposalsRowItemField {
	vgp = 'vgp',
	tg = 'tg',
	tpg = 'tpg',
	tpr = 'tpr',
	countKA = 'countKA',
	price = 'price',
	volumeOfSales = 'volumeOfSales',
	ratingTpr = 'ratingTpr',
	advantagesTpr = 'advantagesTpr',
	rim = 'rim',
	documents = 'documents',
}

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'tr[app-client-proposals-row-item-tr]',
	styleUrls: ['client-proposals-row-item-tr.component.scss'],
	templateUrl: './client-proposals-row-item-tr.component.html',
})
export class ClientProposalsRowItemTrComponent implements OnInit {
	protected readonly ClientTprRowItemField = ClientProposalsRowItemField;
	@Input({ required: true }) item: IClientOffersDto | undefined;
	@Input() defaultCols: IStoreTableBaseColumn[] = [];
	protected rims$: BehaviorSubject<IFilesProposals[]> = new BehaviorSubject<IFilesProposals[]>(
		[],
	);

	protected documents$: BehaviorSubject<IFilesProposals[]> = new BehaviorSubject<
		IFilesProposals[]
	>([]);

	constructor(
		public readonly columnsStateService: ColumnsStateService,
		public readonly checkListService: CheckFileListStateService,
		private readonly modalService: ModalService,
	) {
		this.checkListService.checkFiles$.subscribe(checkFiles => {
			const rims = this.rims$.value;
			const documents = this.documents$.value;

			if (checkFiles.length) {
				for (let i = 0; i < checkFiles.length; i++) {
					this.rims$.next(
						rims.map(rim => {
							if (checkFiles[i].id === rim.id) {
								rim.checked = true;
							} else {
								rim.checked = false;
							}

							return rim;
						}),
					);

					this.documents$.next(
						documents.map(document => {
							if (checkFiles[i].id === document.id) {
								document.checked = true;
							} else {
								document.checked = false;
							}

							return document;
						}),
					);
				}
			} else {
				this.rims$.next(
					rims.map(rim => {
						rim.checked = false;

						return rim;
					}),
				);

				this.documents$.next(
					documents.map(document => {
						document.checked = false;

						return document;
					}),
				);
			}
		});
	}

	ngOnInit() {
		if (this.item) {
			if (this.item.promotionalMaterials) {
				this.rims$.next(this.item.promotionalMaterials.filter(item => item !== null));
			}
			if (this.item.documents) {
				this.documents$.next(this.item.documents.filter(item => item !== null));
			}
		}
	}

	protected readonly TooltipTheme = TooltipTheme;
	protected readonly TooltipPosition = TooltipPosition;

	openPopoverRimsView() {
		const rims = this.rims$.value;

		this.modalService.open(ClientProposalsViewFilesPopoverComponent, { data: { files: rims } });
	}

	openPopoverDocumentView() {
		const documents = this.documents$.value;

		this.modalService.open(ClientProposalsViewFilesPopoverComponent, {
			data: { files: documents },
		});
	}
}
