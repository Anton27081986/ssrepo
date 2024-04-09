import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ClientsCardFacadeService } from '@app/core/facades/client-card-facade.service';
import { IClientDto } from '@app/core/models/company/client-dto';
import { Observable } from 'rxjs';

@UntilDestroy()
@Component({
	selector: 'app-client-card-basic',
	templateUrl: './client-card-basic.component.html',
	styleUrls: ['./client-card-basic.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientCardBasicComponent implements OnInit {
	public client$: Observable<IClientDto | null>;

	public constructor(public readonly clientCardListFacade: ClientsCardFacadeService) {
		this.client$ = this.clientCardListFacade.client$;
	}

	public ngOnInit() {}
}
