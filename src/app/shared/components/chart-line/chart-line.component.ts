import { Component, effect, input, signal } from '@angular/core';
import {TooltipDirective} from "@app/shared/components/tooltip/tooltip.directive";

export interface ChartLineItem {
	label?: string;
	value: number;
	color?: string;
}

@Component({
	selector: 'ss-chart-line',
	templateUrl: './chart-line.component.html',
	styleUrls: ['./chart-line.component.scss'],
	imports: [
		TooltipDirective
	],
	standalone: true
})
export class ChartLineComponent {
	public data = input<ChartLineItem[]>([]);

	public width = signal(0);

	constructor() {
		effect(() => {
			this.width.set(this.data().reduce((prev, next) => {
				return prev + next.value;
			}, 0))
		});
	}
}
