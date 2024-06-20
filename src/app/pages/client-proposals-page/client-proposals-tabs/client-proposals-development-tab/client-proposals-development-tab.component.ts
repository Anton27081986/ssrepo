import { UntilDestroy } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@UntilDestroy()
@Component({
	selector: 'app-client-proposals-development-tab-tab',
	templateUrl: './client-proposals-development-tab.component.html',
	styleUrls: ['./client-proposals-development-tab.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientProposalsDevelopmentTabComponent {}
