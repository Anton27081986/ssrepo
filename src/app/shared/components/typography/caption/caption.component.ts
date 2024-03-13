import { Component, Input } from '@angular/core';

@Component({
	selector: 'ss-caption',
	templateUrl: './caption.component.html',
	styleUrls: ['./caption.component.scss'],
})
export class CaptionComponent {
	@Input() size: '1' | '2' = '1';
}
