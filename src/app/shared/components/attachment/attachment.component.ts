import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { CaptionComponent } from '@app/shared/components/typography/caption/caption.component';
import { FileSizePipe } from '@app/core/pipes/size.pipe';
import { CommonModule, NgIf } from '@angular/common';

@Component({
	selector: 'ss-attachment',
	templateUrl: './attachment.component.html',
	styleUrls: ['./attachment.component.scss'],
	imports: [
		CommonModule,
		IconComponent,
		CaptionComponent,
		FileSizePipe,
		NgIf,
	],
	standalone: true,
})
export class AttachmentComponent {
	@Input()
	public title: string | undefined;

	@Input()
	public size: string | number | undefined;

	@Input()
	public readonly = true;

	@Output()
	protected delete = new EventEmitter();
}
