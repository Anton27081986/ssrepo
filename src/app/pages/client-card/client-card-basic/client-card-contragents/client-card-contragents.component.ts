import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IClientDto } from '@app/core/models/company/client-dto';
import { ClientsCardFacadeService } from '@app/core/facades/client-card-facade.service';
import { IContractorItemDto } from '@app/core/models/company/contractor-item-dto';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ITableItem } from '@app/shared/components/table/table.component';

@UntilDestroy()
@Component({
	selector: 'ss-client-card-contragents',
	templateUrl: './client-card-contragents.component.html',
	styleUrls: ['./client-card-contragents.component.scss'],
})
export class ClientCardContragentsComponent implements OnInit {
	public contractors$: Observable<IContractorItemDto[] | null>;

	private clientId: number | undefined;

	public tableItems: ITableItem[] = [];

	public constructor(public readonly clientCardListFacade: ClientsCardFacadeService) {
		this.contractors$ = this.clientCardListFacade.contractors$;
	}

	ngOnInit() {
		this.clientCardListFacade.contractors$.pipe(untilDestroyed(this)).subscribe(contractors => {
			if (contractors) {
				this.tableItems = <ITableItem[]>contractors;
			}
		});
		this.clientCardListFacade.clientId$.pipe(untilDestroyed(this)).subscribe(clientId => {
			if (clientId) {
				this.clientId = clientId;
				this.getContractors(true);
			}
		});
	}

	private getContractors(isActiveOnly: boolean) {
		this.clientCardListFacade.getContractors(this.clientId!, isActiveOnly);
	}

	protected onActiveContractorChange(e: Event) {
		this.getContractors(!(e.currentTarget! as HTMLInputElement).checked);
	}
}
