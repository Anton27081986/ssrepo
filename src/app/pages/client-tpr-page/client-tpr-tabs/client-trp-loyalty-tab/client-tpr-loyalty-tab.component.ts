import { UntilDestroy } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@UntilDestroy()
@Component({
	selector: 'app-client-tpr-loyalty-tab',
	templateUrl: './client-tpr-loyalty-tab.component.html',
	styleUrls: ['./client-tpr-loyalty-tab.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientTprLoyaltyTabComponent {}
