import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {TextComponent} from "@app/shared/components/typography/text/text.component";
import {IconComponent} from "@app/shared/components/icon/icon.component";

@Component({
	selector: 'ss-accordion',
	templateUrl: './accordion.component.html',
	styleUrls: ['./accordion.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TextComponent,
		IconComponent
	],
	standalone: true
})
export class AccordionComponent {
	@Input() public title: string = '';
	@Output() public onToggle: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() isExpanded: boolean = false;

	public toggle() {
		this.isExpanded = !this.isExpanded;
		this.onToggle.emit(this.isExpanded);
	}
}
