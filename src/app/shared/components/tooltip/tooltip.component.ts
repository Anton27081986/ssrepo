import { Component } from '@angular/core';
import { TooltipPosition, TooltipTheme } from './tooltip.enums';

@Component({
	selector: 'ss-tooltip',
	templateUrl: './tooltip.component.html',
	styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent {
	public position: TooltipPosition = TooltipPosition.DEFAULT;
	public theme: TooltipTheme = TooltipTheme.DEFAULT;
	public tooltip = '';
	public left = 0;
	public top = 0;
	public visible = false;
}
