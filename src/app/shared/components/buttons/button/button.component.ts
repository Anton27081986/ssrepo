import { Component, Input } from '@angular/core';

@Component({
	selector: 'ss-button',
	templateUrl: './button.component.html',
	styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
	@Input() public type:
		| 'primary'
		| 'secondary'
		| 'muted'
		| 'tertiary'
		| 'quaternary'
		| 'usually'
		| 'outline' = 'primary';

	@Input() public size: 'large' | 'medium' | 'small' = 'medium';
	@Input() public disabled: boolean = false;
}
