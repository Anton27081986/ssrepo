import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	HostListener,
	Input,
} from '@angular/core';
import { CheckFileListStateService } from '@app/pages/client-proposals-page/client-proposals/check-file-list-state.service';
import { IFilesProposals } from '@app/core/models/client-proposails/client-offers';
import { rotateAnimation } from '@app/core/animations';
import { TextComponent } from '@app/shared/components/typography/text/text.component';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { CaptionComponent } from '@app/shared/components/typography/caption/caption.component';
import { AsyncPipe } from '@angular/common';

@Component({
	selector: 'ss-file-picker',
	templateUrl: './file-picker.component.html',
	styleUrls: ['./file-picker.component.scss'],
	animations: [rotateAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TextComponent, IconComponent, CaptionComponent, AsyncPipe],
	standalone: true,
})
export class FilePickerComponent {
	@Input()
	public size: 'small' | 'large' | 'medium' = 'medium';

	@Input()
	public title = '';

	@Input()
	isExpanded = false;

	public count = 0;

	constructor(
		private readonly elem: ElementRef,
		protected readonly checkListFile: CheckFileListStateService
	) {}

	@HostListener('document:click', ['$event'])
	DocumentClick(event: Event) {
		if (this.isExpanded) {
			this.isExpanded = this.elem.nativeElement.contains(event.target);
		}
	}

	public toggle() {
		this.isExpanded = !this.isExpanded;
		// this.onToggle.emit(this.isExpanded);
	}

	dropFile(file: IFilesProposals) {
		this.checkListFile.dropFile(file);
	}

	dropAll() {
		this.checkListFile.dropAll();
	}
}
