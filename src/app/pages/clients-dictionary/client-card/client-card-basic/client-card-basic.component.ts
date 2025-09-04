import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ClientsCardFacadeService } from '@app/core/facades/client-card-facade.service';
import { IClientDto } from '@app/core/models/company/client-dto';
import { Observable } from 'rxjs';
import { CardComponent } from '@app/shared/components/card/card.component';
import { ClientCardManagersComponent } from './client-card-managers/client-card-managers.component';
import { ClientCardInfoComponent } from './client-card-info/client-card-info.component';

@Component({
	selector: 'app-client-card-basic',
	templateUrl: './client-card-basic.component.html',
	styleUrls: ['./client-card-basic.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CardComponent,
		ClientCardManagersComponent,
		ClientCardInfoComponent,
	],
	standalone: true,
})
export class ClientCardBasicComponent {
	public client$: Observable<IClientDto | null>;

	constructor(
		public readonly clientCardListFacade: ClientsCardFacadeService
	) {
		this.client$ = this.clientCardListFacade.client$;
	}
}
