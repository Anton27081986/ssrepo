import { Component, Input } from '@angular/core';

@Component({
	selector: 'ss-text',
	templateUrl: './text.component.html',
	styleUrls: ['./text.component.scss'],
})
export class TextComponent {
	@Input() size: '1' | '2' | '3' = '1';
	@Input() weight: 'semi-bold' | 'medium' | 'regular' = 'medium';
}
