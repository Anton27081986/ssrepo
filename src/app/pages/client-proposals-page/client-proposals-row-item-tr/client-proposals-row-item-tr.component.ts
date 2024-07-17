import { Component, Input, OnInit } from '@angular/core';
import { ColumnsStateService } from '@app/core/columns.state.service';
import {
	IAdvantage,
	IClientOffersDto,
	IClientPropNewProducts,
	IClientPropProductionGroups,
	IClientPropTovGroups,
	IFilesProposals,
	IPrice,
} from '@app/core/models/client-proposails/client-offers';
import { IStoreTableBaseColumn } from '@app/core/store';
import { TooltipPosition, TooltipTheme } from '@app/shared/components/tooltip/tooltip.enums';
import { CheckFileListStateService } from '@app/pages/client-proposals-page/client-proposals-table-vgp/check-file-list-state.service';
import { BehaviorSubject } from 'rxjs';

export enum ClientProposalsRowItemField {
	vgp = 'vgp',
	tg = 'tg',
	tpg = 'tpg',
	tpr = 'tpr',
	TPRrating = 'TPRrating',
	countKA = 'countKA',
	countSell = 'countSell',
	price = 'price',
	volumeOfSales = 'volumeOfSales',
	ratingTpr = 'ratingTpr',
	advantagesTpr = 'advantagesTpr',
	analoguesOfCompetitors = 'analoguesOfCompetitors',
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
	protected clientPropTovGroups: IClientPropTovGroups[] = [];
	protected clientPropProductionGroup: IClientPropProductionGroups[] = [];
	protected clientPropNewProducts: IClientPropNewProducts[] = [];
	protected saleClientsCount: number[] = [];
	protected salesWeight: number[] = [];
	protected ratings: number[] = [];
	protected prices: IPrice[] = [];
	protected advantagesTpr: IAdvantage[] = [];
	protected rims$: BehaviorSubject<IFilesProposals[]> = new BehaviorSubject<IFilesProposals[]>(
		[],
	);

	protected documents$: BehaviorSubject<IFilesProposals[]> = new BehaviorSubject<
		IFilesProposals[]
	>([]);

	constructor(
		public readonly columnsStateService: ColumnsStateService,
		public readonly checkListService: CheckFileListStateService,
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
			this.clientPropTovGroups = this.item.clientPropTovGroups;

			this.clientPropProductionGroup = this.clientPropTovGroups
				.map(item => item.clientPropProductionGroups)
				.flat();

			this.clientPropNewProducts = this.clientPropProductionGroup
				.map(item => item.clientPropNewProducts)
				.flat();

			this.saleClientsCount = this.clientPropNewProducts.map(item => item.saleClientsCount);

			this.salesWeight = this.clientPropNewProducts.map(item => item.salesWeight);

			this.ratings = this.clientPropNewProducts.map(item => item.rating);

			this.prices = this.clientPropNewProducts
				.map(item => item.prices)
				.filter(item => item !== null)
				.flat();

			this.advantagesTpr = this.clientPropNewProducts.map(item => item.advantages).flat();

			this.rims$.next(
				this.clientPropNewProducts
					.map(item => item.promotionalMaterials)
					.filter(item => item !== null)
					.flat(),
			);

			this.documents$.next(
				this.clientPropNewProducts
					.map(item => item.documents)
					.filter(item => item !== null)
					.flat(),
			);
		}
	}

	protected readonly TooltipTheme = TooltipTheme;
	protected readonly TooltipPosition = TooltipPosition;

	onToggle() {
		const filterDoc = this.documents$.value.filter(x => x.checked);
		const filterRim = this.rims$.value.filter(x => x.checked);

		this.checkListService.changeArrFile([...filterDoc, ...filterRim]);
	}
}
