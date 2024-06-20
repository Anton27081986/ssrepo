import { UntilDestroy } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@UntilDestroy()
@Component({
	selector: 'app-client-tpr-loyalty-tab',
	templateUrl: './client-proposals-loyalty-tab.component.html',
	styleUrls: ['./client-proposals-loyalty-tab.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientProposalsLoyaltyTabComponent {}
