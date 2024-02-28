import { Component, Input } from '@angular/core';

@Component({
	selector: 'ss-text-1',
	templateUrl: './text1.component.html',
	styleUrls: ['./text1.component.scss'],
})
export class Text1Component {
	@Input() weight: 'semi-bold' | 'medium' | 'regular' = 'medium';
}
