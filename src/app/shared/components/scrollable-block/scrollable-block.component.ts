import { Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'app-scrollable-block',
	templateUrl: './scrollable-block.component.html',
	styleUrls: ['./scrollable-block.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {
		class: 'scrollable-block',
		'[class.scrollable-block--h-hidden]': '!horizontalScroll',
		'[class.scrollable-block--v-hidden]': '!verticalScroll',
		'[class.scrollable-block--padding]': 'paddingInline',
		'[class.scrollable-block--not-auto-size]': 'disableAutoSize',
	},
})
export class ScrollableBlockComponent {
	@Input() horizontalScroll: boolean = false;
	@Input() verticalScroll: boolean = true;
	@Input() paddingInline: boolean = false;
	@Input() disableAutoSize: boolean = false;
}
