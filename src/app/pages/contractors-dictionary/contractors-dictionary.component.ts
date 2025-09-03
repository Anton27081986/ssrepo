import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'contractors-dictionary',
	templateUrl: './contractors-dictionary.component.html',
	styleUrls: ['./contractors-dictionary.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [],
})
export class ContractorsDictionaryComponent {}
