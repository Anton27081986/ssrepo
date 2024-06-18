import { UntilDestroy } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@UntilDestroy()
@Component({
	selector: 'app-client-tpr-trade-list-tab',
	templateUrl: './client-tpr-trade-list-tab.component.html',
	styleUrls: ['./client-tpr-trade-list-tab.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientTprTradeTabComponent {}
