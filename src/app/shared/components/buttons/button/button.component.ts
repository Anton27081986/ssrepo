import { Component, Input } from '@angular/core';

@Component({
	selector: 'ss-button',
	templateUrl: './button.component.html',
	styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
	@Input() type: 'primary' | 'secondary' | 'muted' | 'tertiary' | 'outline' = 'primary';
	@Input() size: 'large' | 'medium' | 'small' = 'medium';
}
