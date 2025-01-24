import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientsCardFacadeService } from '@app/core/facades/client-card-facade.service';
import { IContractorItemDto } from '@app/core/models/company/contractor-item-dto';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {ITableItem, TableComponent} from '@app/shared/components/table/table.component';
import { TableState } from '@app/shared/components/table/table-state';
import {LoaderComponent} from "@app/shared/components/loader/loader.component";
import {AsyncPipe, NgIf} from "@angular/common";
import {CardComponent} from "@app/shared/components/card/card.component";
import {HeadlineComponent} from "@app/shared/components/typography/headline/headline.component";
import {TextComponent} from "@app/shared/components/typography/text/text.component";

@UntilDestroy()
@Component({
	selector: 'ss-client-card-contractors',
	templateUrl: './client-card-contractors.component.html',
	styleUrls: ['./client-card-contractors.component.scss'],
	imports: [
		LoaderComponent,
		NgIf,
		AsyncPipe,
		CardComponent,
		HeadlineComponent,
		TextComponent,
		TableComponent
	],
	standalone: true
})
export class ClientCardContractorsComponent implements OnInit {
	public contractors$: Observable<IContractorItemDto[] | null>;

	private clientId: number | undefined;

	public tableItems: ITableItem[] = [];

	public isLoading$: Observable<boolean>;

	public constructor(
		public readonly clientCardListFacade: ClientsCardFacadeService,
		private readonly ref: ChangeDetectorRef,
	) {
		this.contractors$ = this.clientCardListFacade.contractors$;
		this.isLoading$ = this.clientCardListFacade.isContractorsLoading$;
	}

	public ngOnInit() {
		this.clientCardListFacade.contractors$.pipe(untilDestroyed(this)).subscribe(contractors => {
			if (contractors) {
				this.tableItems = this.mapClientsToTableItems(<ITableItem[]>contractors);
				this.ref.detectChanges();
			}
		});
		this.clientCardListFacade.clientId$.pipe(untilDestroyed(this)).subscribe(clientId => {
			if (clientId) {
				this.clientId = clientId;
				this.getContractors(true);
			}
		});
	}

	private mapClientsToTableItems(client: any[]) {
		return client.map(x => {
			const tableItem: any = {};

			tableItem.id = {
				text: x.id !== undefined ? x.id.toString() : '-',
				url: x.linkToDetail !== undefined ? x.linkToDetail : '',
			};

			tableItem.inn = x.inn !== undefined ? x.inn : '-';
			tableItem.name = x.name !== undefined ? x.name : '-';
			tableItem.status = x.status !== undefined ? x.status.name : '-';
			tableItem.creditStatus = x.creditStatus !== undefined ? x.creditStatus.name : '-';

			return tableItem;
		});
	}

	private getContractors(isActiveOnly: boolean) {
		this.clientCardListFacade.getContractors(this.clientId!, isActiveOnly);
	}

	protected onActiveContractorChange(e: Event) {
		this.getContractors(!(e.currentTarget! as HTMLInputElement).checked);
	}

	protected readonly TableState = TableState;
}
