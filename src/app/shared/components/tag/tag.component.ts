import { Component, Input } from '@angular/core';

@Component({
	selector: 'ss-tag',
	templateUrl: './tag.component.html',
	styleUrls: ['./tag.component.scss'],
	standalone: true
})
export class TagComponent {
	@Input()
	public type: 'ok' | 'error' | 'warning' | undefined;
}
