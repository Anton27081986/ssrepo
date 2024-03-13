import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
	selector: 'app-clients-list',
	templateUrl: './clients-list.component.html',
	styleUrls: ['./clients-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsListComponent {
	public clientsMock = [
		{
			name: 'Alex',
			id: 1,
		},
		{
			name: 'Sergey',
			id: 2,
		},
	];
}
