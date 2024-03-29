import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'ss-attachment',
	templateUrl: './attachment.component.html',
	styleUrls: ['./attachment.component.scss'],
})
export class AttachmentComponent {
	@Input() public title: string | undefined;
	@Input() public size: string | number | undefined;
	@Input() public readonly: boolean = true;
	@Output() protected delete = new EventEmitter();
}
