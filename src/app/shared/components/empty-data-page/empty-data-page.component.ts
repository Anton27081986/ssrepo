import { Component, HostBinding, Input } from '@angular/core';

@Component({
	selector: 'ss-empty-data-page',
	templateUrl: './empty-data-page.component.html',
	styleUrls: ['./empty-data-page.component.scss'],
})
export class EmptyDataPageComponent {
	@HostBinding('style.width')
	@Input()
	public width = '100px';

	@HostBinding('style.height')
	@Input()
	public height = '100px';

	@Input()
	public isNotFound = false;
}
