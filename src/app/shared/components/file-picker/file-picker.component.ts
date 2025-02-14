import { ChangeDetectionStrategy, Component, ElementRef, HostListener, Input } from '@angular/core';
import { CheckFileListStateService } from '@app/pages/client-proposals-page/client-proposals/check-file-list-state.service';
import { IFilesProposals } from '@app/core/models/client-proposails/client-offers';
import { rotateAnimation } from '@app/core/animations';

@Component({
	selector: 'ss-file-picker',
	templateUrl: './file-picker.component.html',
	styleUrls: ['./file-picker.component.scss'],
	animations: [rotateAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilePickerComponent {
	@Input() public size: 'small' | 'large' | 'medium' = 'medium';
	@Input() public title: string = '';
	@Input() isExpanded: boolean = false;
	public count: number = 0;

	constructor(
		private readonly elem: ElementRef,
		protected readonly checkListFile: CheckFileListStateService,
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
