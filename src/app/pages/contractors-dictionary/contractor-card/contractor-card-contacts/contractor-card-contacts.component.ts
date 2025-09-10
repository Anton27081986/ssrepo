import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-contractor-card-contacts',
	templateUrl: './contractor-card-contacts.component.html',
	styleUrls: ['./contractor-card-contacts.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [],
})
export class ContractorCardContactsComponent {
	constructor() {}
}
