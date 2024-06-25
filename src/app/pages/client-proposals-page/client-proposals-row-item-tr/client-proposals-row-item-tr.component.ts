import { Component, Input } from '@angular/core';
import { ColumnsStateService } from '@app/core/columns.state.service';

export enum ClientProposalsRowItemField {
	tg = 'tg',
	tpg = 'tpg',
	tpr = 'tpr',
	TPRrating = 'TPRrating',
	vgp = 'vgp',
	countKA = 'countKA',
	countSell = 'countSell',
	price = 'price',
	volumeOfSales = 'volumeOfSales',
	ratingTpr = 'ratingTpr',
	ytpTpr = 'ytpTpr',
	analoguesOfCompetitors = 'analoguesOfCompetitors',
	rim = 'rim',
	documents = 'documents',
}

@Component({
	selector: 'tr[app-client-proposals-row-item-tr]',
	styleUrls: ['client-proposals-row-item-tr.component.scss'],
	templateUrl: './client-proposals-row-item-tr.component.html',
})
export class ClientProposalsRowItemTrComponent {
	protected readonly ClientTprRowItemField = ClientProposalsRowItemField;
	@Input({ required: true }) item: any | undefined; // заглушка

	constructor(public readonly columnsStateService: ColumnsStateService) {}
}
