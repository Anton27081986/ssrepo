import { Component, Input } from '@angular/core';

@Component({
	selector: 'ss-title-main',
	templateUrl: './title-main.component.html',
	styleUrls: ['./title-main.component.scss'],
})
export class TitleMainComponent {
	@Input() size: 28 | 24 = 28;
}
