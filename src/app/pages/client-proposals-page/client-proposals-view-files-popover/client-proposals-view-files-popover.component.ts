import { Component, Inject, OnInit } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import { BehaviorSubject } from 'rxjs';
import { IFilesProposals } from '@app/core/models/client-proposails/client-offers';
import { CheckFileListStateService } from '@app/pages/client-proposals-page/client-proposals-table-vgp/check-file-list-state.service';

interface FileData {
	files: IFilesProposals[];
	checkListService: CheckFileListStateService;
}

@Component({
	selector: 'app-client-proposals-view-files-popover',
	styleUrls: ['client-proposals-view-files-popover.component.scss'],
	templateUrl: './client-proposals-view-files-popover.component.html',
})
export class ClientProposalsViewFilesPopoverComponent implements OnInit {
	protected readonly files$: BehaviorSubject<IFilesProposals[]> = new BehaviorSubject<
		IFilesProposals[]
	>([]);

	constructor(
		private readonly modalRef: ModalRef,
		@Inject(DIALOG_DATA) private readonly data: FileData,
	) {}

	protected close() {
		this.modalRef.close();
	}

	onToggle(uniqId: string) {
		const file = this.files$.value.find(x => x.uniqId === uniqId);

		if (file) {
			this.data.checkListService.changeArrFile(file);
		}
	}

	ngOnInit() {
		let files;

		if (this.data.checkListService.checkFiles$.value.length) {
			files = this.data.files.map(file => {
				const findFile = this.data.checkListService.checkFiles$.value.find(
					checkFiles => file.uniqId === checkFiles.uniqId,
				);
				console.log(this.data.checkListService.checkFiles$.value);
				file.checked = !!findFile;

				return file;
			});
		} else {
			files = this.data.files.map(file => {
				file.checked = false;

				return file;
			});
		}

		this.files$.next(files);
	}
}
