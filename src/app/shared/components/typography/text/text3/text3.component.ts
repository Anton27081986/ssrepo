import { Component, Input } from '@angular/core';

@Component({
	selector: 'ss-text-3',
	templateUrl: './text3.component.html',
	styleUrls: ['./text3.component.scss'],
})
export class Text3Component {
	@Input() weight: 'medium' | 'regular' = 'medium';
}
