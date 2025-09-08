import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-contractor-card-basic',
	templateUrl: './contractor-card-basic.component.html',
	styleUrls: ['./contractor-card-basic.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [],
})
export class ContractorCardBasicComponent {
	constructor() {}
}
