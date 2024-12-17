import { Component, Input } from '@angular/core';

@Component({
	selector: 'ss-tag-v2',
	templateUrl: './tag-v2.component.html',
	styleUrls: ['./tag-v2.component.scss'],
})
export class TagV2Component {
	@Input()
	public state: 'normal' | 'success' | 'info' | 'warning' | 'danger' | 'clear' | 'outline' =
		'normal';

	@Input() public size: 'large' | 'medium' | 'small' = 'medium';
}
