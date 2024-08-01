import { Component, Input } from '@angular/core';

@Component({
	selector: 'ss-caption',
	templateUrl: './caption.component.html',
	styleUrls: ['./caption.component.scss'],
})
export class CaptionComponent {
	@Input() public size: '1' | '2' = '1';
	@Input() public weight: 'semi-bold' | 'medium' | 'regular' = 'medium';
	@Input() public color: 'black' | 'gray' = 'black';
}
