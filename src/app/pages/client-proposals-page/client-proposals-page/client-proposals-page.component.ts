import { Component } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Router } from '@angular/router';
import { ClientProposalsApiService } from '@app/core/api/client-proposails-api.service';
import { TooltipPosition, TooltipTheme } from '@app/shared/components/tooltip/tooltip.enums';

export enum TypeReportEnum {
	took = 0,
	skipped = 1,
}

@UntilDestroy()
@Component({
	selector: 'app-client-proposals-page',
	templateUrl: './client-proposals-page.component.html',
	styleUrls: ['./client-proposals-page.component.scss'],
})
export class ClientProposalsPageComponent {
	constructor(
		private readonly _router: Router,
		private readonly apiService: ClientProposalsApiService,
	) {}

	protected readonly typeReport = TypeReportEnum;

	protected getSearchClient(client: { id: number; title: string }) {
		if (client) {
			this._router.navigate(['/client-proposals-page', client.id]).then();
		}
	}

	protected download(type: TypeReportEnum) {
		this.apiService
			.downloadReport(type)
			.pipe(untilDestroyed(this))
			.subscribe(val => {
				const fileURL = window.URL.createObjectURL(val);
				const link = document.createElement('a');

				link.href = fileURL;
				link.click();

				window.URL.revokeObjectURL(fileURL);
			});
	}

	protected readonly TooltipPosition = TooltipPosition;
	protected readonly TooltipTheme = TooltipTheme;
}
