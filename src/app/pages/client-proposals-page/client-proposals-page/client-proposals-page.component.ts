import { Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Router } from '@angular/router';

@UntilDestroy()
@Component({
	selector: 'app-client-proposals-page',
	templateUrl: './client-proposals-page.component.html',
	styleUrls: ['./client-proposals-page.component.scss'],
})
export class ClientProposalsPageComponent {
	constructor(private readonly _router: Router) {}

	protected getSearchClient(client: { id: number; title: string }) {
		if (client) {
			this._router.navigate(['/client-proposals-page', client.id]).then();
		}
	}
}
