import { Component, Inject, OnInit } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import { BehaviorSubject } from 'rxjs';
import { IFilesProposals } from '@app/core/models/client-proposails/client-offers';

interface FileData {
	files: IFilesProposals[];
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

	// onToggle() {
	// 	const filterDoc = this.documents$.value.filter(x => x.checked);
	// 	const filterRim = this.rims$.value.filter(x => x.checked);
	//
	// 	this.checkListService.changeArrFile([...filterDoc, ...filterRim]);
	// }

	ngOnInit() {
		this.files$.next(this.data.files);
	}
}
