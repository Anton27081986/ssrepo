import { Component, HostBinding, Input } from '@angular/core';

@Component({
	selector: 'ss-card',
	templateUrl: './card.component.html',
	styleUrls: ['./card.component.scss'],
})
export class CardComponent {
	@HostBinding('style.padding')
	@Input()
	padding = '32px';
}
