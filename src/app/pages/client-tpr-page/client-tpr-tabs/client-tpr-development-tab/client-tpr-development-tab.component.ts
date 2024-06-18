import { UntilDestroy } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@UntilDestroy()
@Component({
	selector: 'app-client-tpr-development-tab-tab',
	templateUrl: './client-tpr-development-tab-tab.component.html',
	styleUrls: ['./client-tpr-development-tab-tab.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientTprDevelopmentTabComponent {}
