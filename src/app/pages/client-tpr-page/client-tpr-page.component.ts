import { Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
	selector: 'app-client-tpr-page',
	templateUrl: './client-tpr-page.component.html',
	styleUrls: ['./client-tpr-page.component.scss'],
})
export class ClientTprPageComponent {
	protected getSearchClient(client: { id: number; date?: string }) {
		return client;
	}
}
