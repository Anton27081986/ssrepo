import { UntilDestroy } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@UntilDestroy()
@Component({
	selector: 'app-client-proposals-trade-list-tab',
	templateUrl: './client-proposals-trade-list-tab.component.html',
	styleUrls: ['./client-proposals-trade-list-tab.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientProposalsTradeListTabComponent {}
