import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'ss-accordion',
	templateUrl: './accordion.component.html',
	styleUrls: ['./accordion.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionComponent {
	@Input() public title: string = '';
	public isOpen: boolean = false;

	public toggle() {
		this.isOpen = !this.isOpen;
	}
}
