import { UntilDestroy } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@UntilDestroy()
@Component({
	selector: 'app-client-tpr-samples-tab',
	templateUrl: './client-tpr-samples-tab.component.html',
	styleUrls: ['./client-tpr-samples-tab.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientTprSamplesTabComponent {}
