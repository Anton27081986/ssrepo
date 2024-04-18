import { Component, HostListener, Input } from '@angular/core';

@Component({
	selector: 'ss-tooltip-menu',
	templateUrl: './tooltip-menu.component.html',
	styleUrls: ['./tooltip-menu.component.scss'],
})
export class TooltipMenuComponent {
	@Input() public icon!: string;

	protected isHidden: boolean = true;

	@HostListener('mouseleave')
	public onMouseLeave(): void {
		this.isHidden = true;
	}
}
