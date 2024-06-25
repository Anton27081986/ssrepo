import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'ss-file-picker',
	templateUrl: './file-picker.component.html',
	styleUrls: ['./file-picker.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilePickerComponent {
	@Input() public title: string = '';
	// @Output() public onToggle: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() isExpanded: boolean = false;
	public count: number = 0;

	public toggle() {
		this.isExpanded = !this.isExpanded;
		// this.onToggle.emit(this.isExpanded);
	}
}
