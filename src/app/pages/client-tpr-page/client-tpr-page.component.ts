import { Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Router } from '@angular/router';

@UntilDestroy()
@Component({
	selector: 'app-client-tpr-page',
	templateUrl: './client-tpr-page.component.html',
	styleUrls: ['./client-tpr-page.component.scss'],
})
export class ClientTprPageComponent {
	constructor(private readonly _router: Router) {}

	protected getSearchClient(client: { id: number; title: string }) {
		if (client) {
			this._router.navigate(['/client-tpr-page', client.id]).then();
		}
	}
}
