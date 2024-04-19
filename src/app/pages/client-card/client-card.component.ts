import { Component, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ActivatedRoute } from '@angular/router';
import { ClientsCardFacadeService } from '@app/core/facades/client-card-facade.service';
import { IClientDto } from '@app/core/models/company/client-dto';
import { Observable } from 'rxjs';

@UntilDestroy()
@Component({
	selector: 'app-client-card',
	templateUrl: './client-card.component.html',
	styleUrls: ['./client-card.component.scss'],
})
export class ClientCardComponent implements OnInit {
	public client$: Observable<IClientDto | null>;
	public clientId$: Observable<number | null>;

	public constructor(
		private readonly router: ActivatedRoute,
		public readonly clientCardListFacade: ClientsCardFacadeService,
	) {
		this.client$ = this.clientCardListFacade.client$;
		this.clientId$ = this.clientCardListFacade.clientId$;
	}

	public ngOnInit() {
		const clientId = Number.parseInt(this.router.snapshot.paramMap.get('id')!, 10);

		if (clientId) {
			this.clientCardListFacade.setClientId(clientId);
			this.clientCardListFacade.getClientCardById(clientId);
		}
	}

	public selectTab(ev: any) {
		console.log(ev);
	}
}
