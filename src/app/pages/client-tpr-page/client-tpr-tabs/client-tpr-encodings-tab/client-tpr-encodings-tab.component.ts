import { UntilDestroy } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@UntilDestroy()
@Component({
	selector: 'app-client-tpr-encodings-tab',
	templateUrl: './client-tpr-encodings-tab.component.html',
	styleUrls: ['./client-tpr-encodings-tab.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientTprEncodingsTabComponent {}
