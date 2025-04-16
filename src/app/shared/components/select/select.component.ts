import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CaptionComponent } from '@app/shared/components/typography/caption/caption.component';
import { CommonModule, NgClass } from '@angular/common';

@Component({
	selector: 'ss-select',
	templateUrl: './select.component.html',
	styleUrls: ['./select.component.scss'],
	imports: [CommonModule, CaptionComponent, NgClass],
	standalone: true,
})
export class SelectComponent {
	@Input()
	public size: 'large' | 'medium' | 'small' = 'medium';

	@Input()
	public label: string | undefined;

	@Input()
	public error: string | undefined;

	@Input()
	public disabled = false;

	@Input()
	public placeholder = '';

	@Output()
	public onChange = new EventEmitter<any>();

	public onClick(el: EventTarget | null) {
		if (el) {
			this.onChange.emit((el as HTMLSelectElement).value);
		}
	}
}
