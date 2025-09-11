import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-contractors-page',
	templateUrl: './contractors-page.component.html',
	styleUrls: ['./contractors-page.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [RouterOutlet],
})
export class ContractorsPageComponent {}
