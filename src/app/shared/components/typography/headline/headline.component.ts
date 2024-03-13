import { Component, Input } from '@angular/core';

@Component({
	selector: 'ss-headline',
	templateUrl: './headline.component.html',
	styleUrls: ['./headline.component.scss'],
})
export class HeadlineComponent {
	@Input() size: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' = 'h1';
	@Input() weight: 'semi-bold' | 'medium' = 'semi-bold';
}
