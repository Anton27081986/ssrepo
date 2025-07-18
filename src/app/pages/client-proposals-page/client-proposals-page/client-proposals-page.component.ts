import { Component } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Router } from '@angular/router';
import { ClientProposalsApiService } from '@app/core/api/client-proposails-api.service';
import {
	TooltipPosition,
	TooltipTheme,
} from '@app/shared/components/tooltip/tooltip.enums';
import { PermissionsFacadeService } from '@app/core/facades/permissions-facade.service';
import { Permissions } from '@app/core/constants/permissions.constants';
import { ClientProposalsFacadeService } from '@app/core/facades/client-proposals-facade.service';
import { ModulesWithPermissionsEnum } from '@app/core/models/modules-with-permissions';
import { HeadlineComponent } from '@app/shared/components/typography/headline/headline.component';
import { CommonModule, NgIf } from '@angular/common';
import { TextComponent } from '@app/shared/components/typography/text/text.component';
import { TooltipMenuComponent } from '@app/shared/components/tooltip-menu/tooltip-menu.component';
import { CaptionComponent } from '@app/shared/components/typography/caption/caption.component';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { SearchInputComponent } from '@app/shared/components/inputs/search-input/search-input.component';
import { TooltipDirective } from '@app/shared/components/tooltip/tooltip.directive';

export enum TypeReportEnum {
	took = 0,
	skipped = 1,
}

@UntilDestroy()
@Component({
	selector: 'app-client-proposals-page',
	templateUrl: './client-proposals-page.component.html',
	styleUrls: ['./client-proposals-page.component.scss'],
	imports: [
		CommonModule,
		HeadlineComponent,
		NgIf,
		TextComponent,
		TooltipMenuComponent,
		CaptionComponent,
		IconComponent,
		SearchInputComponent,
		TooltipDirective,
	],
	standalone: true,
})
export class ClientProposalsPageComponent {
	protected readonly typeReport = TypeReportEnum;
	protected readonly TooltipPosition = TooltipPosition;
	protected readonly TooltipTheme = TooltipTheme;
	constructor(
		private readonly _router: Router,
		private readonly apiService: ClientProposalsApiService,
		private readonly proposalsPermission: PermissionsFacadeService,
		protected readonly clientProposalsFacadeService: ClientProposalsFacadeService
	) {}

	get canLoadFile(): boolean {
		return this.proposalsPermission.hasPermission(
			ModulesWithPermissionsEnum.Proposals,
			Permissions.CLIENT_PROPOSALS_CAN_DOWNLOADREPORTS
		);
	}

	protected getSearchClient(client: { id: number; title: string }) {
		if (client) {
			this._router.navigate(['/client-proposals-page', client.id]).then();
		}
	}

	protected download(type: TypeReportEnum) {
		this.apiService
			.downloadReport(type)
			.pipe(untilDestroyed(this))
			.subscribe((val) => {
				const fileURL = window.URL.createObjectURL(val);
				const link = document.createElement('a');

				link.href = fileURL;
				link.click();

				window.URL.revokeObjectURL(fileURL);
			});
	}

	protected downloadInstruction(url: string) {
		const link = document.createElement('a');

		link.href = url;
		link.click();
	}
}
