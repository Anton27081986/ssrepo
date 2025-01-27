import { Component, HostListener, Input } from '@angular/core';
import {IconComponent} from "@app/shared/components/icon/icon.component";
import {CommonModule, NgClass} from "@angular/common";

@Component({
	selector: 'ss-tooltip-menu',
	templateUrl: './tooltip-menu.component.html',
	styleUrls: ['./tooltip-menu.component.scss'],
	imports: [
		CommonModule,
		IconComponent,
		NgClass
	],
	standalone: true
})
export class TooltipMenuComponent {
	@Input() public icon!: string;

	protected isHidden: boolean = true;

	@HostListener('mouseleave')
	public onMouseLeave(): void {
		this.isHidden = true;
	}
}
