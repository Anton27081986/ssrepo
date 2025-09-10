import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-contractor-card-model',
	templateUrl: './contractor-card-model.component.html',
	styleUrls: ['./contractor-card-model.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [],
})
export class ContractorCardModelComponent {
	constructor() {}
}
