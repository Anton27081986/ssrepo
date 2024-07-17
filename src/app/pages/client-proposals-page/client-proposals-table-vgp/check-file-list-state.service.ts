import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IFilesProposals } from '@app/core/models/client-proposails/client-offers';

@Injectable({ providedIn: 'root' })
export class CheckFileListStateService {
	public checkFiles$: BehaviorSubject<IFilesProposals[]> = new BehaviorSubject<IFilesProposals[]>(
		[],
	);

	public saveFileUrl$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
	constructor() {}

	changeArrFile(files: IFilesProposals[]) {
		this.checkFiles$.next(files);
	}

	dropFile(dropFile: IFilesProposals) {
		const files = this.checkFiles$.value;
		const walkerFile = files.find(
			file => file.id === dropFile.id && file.type === dropFile.type,
		);
		if (walkerFile) {
			const newFileArr = files.filter(item => item.id !== walkerFile.id);
			this.checkFiles$.next(newFileArr);
		}
	}

	dropAll() {
		this.checkFiles$.next([]);
	}
}
