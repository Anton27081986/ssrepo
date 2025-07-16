import { Component, HostBinding, Input } from '@angular/core';

@Component({
	selector: 'ss-card',
	templateUrl: './card.component.html',
	styleUrls: ['./card.component.scss'],
	standalone: true,
})
export class CardComponent {
	@HostBinding('style.padding')
	@Input()
	public padding = '32px';

	@HostBinding('style.border-radius')
	@Input()
	public radius = '16px';
}
