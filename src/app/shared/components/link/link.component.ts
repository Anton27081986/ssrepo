import { Component, Input } from '@angular/core';

@Component({
	selector: 'ss-link',
	templateUrl: './link.component.html',
	styleUrls: ['./link.component.scss'],
})
export class LinkComponent {
	@Input() href: string | undefined;
}
