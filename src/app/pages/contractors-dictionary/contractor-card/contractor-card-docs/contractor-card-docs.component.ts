import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-contractor-card-docs',
	templateUrl: './contractor-card-docs.component.html',
	styleUrls: ['./contractor-card-docs.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [],
})
export class ContractorCardDocsComponent {
	constructor() {}
}
