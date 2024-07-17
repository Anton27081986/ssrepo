import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ClientsCardFacadeService } from '@app/core/facades/client-card-facade.service';
import { IClientDto } from '@app/core/models/company/client-dto';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-client-card-basic',
	templateUrl: './client-card-basic.component.html',
	styleUrls: ['./client-card-basic.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientCardBasicComponent {
	public client$: Observable<IClientDto | null>;

	public constructor(public readonly clientCardListFacade: ClientsCardFacadeService) {
		this.client$ = this.clientCardListFacade.client$;
	}
}
