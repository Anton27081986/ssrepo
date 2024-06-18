import { UntilDestroy } from '@ngneat/until-destroy';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@UntilDestroy()
@Component({
	selector: 'app-client-tpr-news-line-tab',
	templateUrl: './client-tpr-news-line-tab.component.html',
	styleUrls: ['./client-tpr-news-line-tab.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientTprNewsLineTabComponent {}
