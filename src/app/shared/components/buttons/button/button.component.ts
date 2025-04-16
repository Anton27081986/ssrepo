import { Component, Input } from '@angular/core';

@Component({
	selector: 'ss-button',
	templateUrl: './button.component.html',
	styleUrls: ['./button.component.scss'],
	standalone: true,
})
export class ButtonComponent {
	@Input()
	public type:
		| 'primary'
		| 'secondary'
		| 'muted'
		| 'tertiary'
		| 'quaternary'
		| 'usually'
		| 'warning'
		| 'outline' = 'primary';

	@Input()
	public size: 'large' | 'medium' | 'small' = 'medium';

	@Input()
	public disabled = false;
}
