import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CheckFileListStateService } from '@app/pages/client-proposals-page/client-proposals-table-vgp/check-file-list-state.service';
import { IFilesProposals } from '@app/core/models/client-proposails/client-offers';

@Component({
	selector: 'ss-file-picker',
	templateUrl: './file-picker.component.html',
	styleUrls: ['./file-picker.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilePickerComponent {
	@Input() public size: 'small' | 'large' | 'medium' = 'medium';
	@Input() public title: string = '';
	// @Output() public onToggle: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() isExpanded: boolean = false;
	public count: number = 0;

	constructor(protected readonly checkListFile: CheckFileListStateService) {}

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
