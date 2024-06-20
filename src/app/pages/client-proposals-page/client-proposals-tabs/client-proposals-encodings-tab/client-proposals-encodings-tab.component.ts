import { UntilDestroy } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@UntilDestroy()
@Component({
	selector: 'app-client-proposals-encodings-tab',
	templateUrl: './client-proposals-encodings-tab.component.html',
	styleUrls: ['./client-proposals-encodings-tab.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientProposalsEncodingsTabComponent {}
