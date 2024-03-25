import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ClientsListFacadeService } from '@app/core/facades/clients-list-facade.service';
import { map, Observable } from 'rxjs';
import { IClientItemDto } from '@app/core/models/company/client-item-dto';

@UntilDestroy()
@Component({
	selector: 'app-clients-list',
	templateUrl: './clients-list.component.html',
	styleUrls: ['./clients-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsListComponent {
	public clients$: Observable<IClientItemDto[]>;
	public constructor(private readonly clientsListFacade: ClientsListFacadeService) {
		this.clients$ = clientsListFacade.getClients().pipe(
			map(response => {
				return response.items;
			}),
			untilDestroyed(this),
		);
	}
}
