import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-contractor-card-thanks',
	templateUrl: './contractor-card-thanks.component.html',
	styleUrls: ['./contractor-card-thanks.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [],
})
export class ContractorCardThanksComponent {
	constructor() {}
}
