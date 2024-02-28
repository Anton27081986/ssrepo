import { Component, Input } from '@angular/core';

@Component({
	selector: 'ss-text-2',
	templateUrl: './text2.component.html',
	styleUrls: ['./text2.component.scss'],
})
export class Text2Component {
	@Input() weight: 'semi-bold' | 'medium' | 'regular' = 'medium';
}
