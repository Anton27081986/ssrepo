import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	Output,
	TemplateRef,
} from '@angular/core';
import { TextComponent } from '@app/shared/components/typography/text/text.component';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import {
	ButtonComponent,
	ButtonType,
	IconPosition,
	IconType,
	Size,
} from '@front-components/components';
import { NgClass, NgIf, NgTemplateOutlet } from '@angular/common';

@Component({
	selector: 'ss-accordion',
	templateUrl: './accordion.component.html',
	styleUrls: ['./accordion.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TextComponent,
		IconComponent,
		ButtonComponent,
		NgClass,
		NgTemplateOutlet,
		NgIf,
	],
	standalone: true,
})
export class AccordionComponent {
	@Input()
	public title = '';

	@Input()
	headerRef: TemplateRef<any> | null = null;

	@Input()
	isExpanded = false;

	@Input()
	isMpReservationOrders = false;

	@Output()
	public onToggle: EventEmitter<boolean> = new EventEmitter<boolean>();

	@Output()
	public addRowPosition: EventEmitter<void> = new EventEmitter<void>();

	@Output()
	public removePosition: EventEmitter<void> = new EventEmitter<void>();

	protected readonly Size = Size;
	protected readonly ButtonType = ButtonType;
	protected readonly IconPosition = IconPosition;
	protected readonly IconType = IconType;

	public toggle(): void {
		this.isExpanded = !this.isExpanded;
		this.onToggle.emit(this.isExpanded);
	}

	public addRowInPosition(event: MouseEvent): void {
		event.stopPropagation();
		this.addRowPosition.emit();
	}

	public removeRowInPosition(event: MouseEvent): void {
		event.stopPropagation();
		this.removePosition.emit();
	}
}
