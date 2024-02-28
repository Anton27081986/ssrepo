import { Component, Input } from '@angular/core';

@Component({
	selector: 'ss-h2',
	templateUrl: './h2.component.html',
	styleUrls: ['./h2.component.scss'],
})
export class Headline2Component {
	@Input() size: 18 | 16 = 18;
	@Input() weight: 'semi-bold' | 'medium' = 'semi-bold';
}
