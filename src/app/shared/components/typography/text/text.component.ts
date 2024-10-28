import { Component, Input } from '@angular/core';

@Component({
	selector: 'ss-text',
	templateUrl: './text.component.html',
	styleUrls: ['./text.component.scss'],
})
export class TextComponent {
	@Input() public size: '0' | '1' | '2' | '3' | '4' = '1';
	@Input() public weight: 'semi-bold' | 'medium' | 'regular' = 'medium';
	@Input() public color: 'black' | 'gray' | 'white' = 'black';
}
