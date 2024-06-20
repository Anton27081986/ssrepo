import { UntilDestroy } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@UntilDestroy()
@Component({
	selector: 'app-client-tpr-business-trips-tab',
	templateUrl: './client-proposals-business-trips-tab.component.html',
	styleUrls: ['./client-proposals-business-trips-tab.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientProposalsBusinessTripsTabComponent {}
