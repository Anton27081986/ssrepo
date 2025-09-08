import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-contractor-card-contracts',
	templateUrl: './contractor-card-contracts.component.html',
	styleUrls: ['./contractor-card-contracts.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [],
})
export class ContractorCardContractsComponent {
	constructor() {}
}
