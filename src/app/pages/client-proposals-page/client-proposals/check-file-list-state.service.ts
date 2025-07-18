import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IFilesProposals } from '@app/core/models/client-proposails/client-offers';

@Injectable({ providedIn: 'root' })
export class CheckFileListStateService {
	public checkFiles$: BehaviorSubject<IFilesProposals[]> =
		new BehaviorSubject<IFilesProposals[]>([]);

	changeArrFile(newFile: IFilesProposals) {
		let savedFiles = this.checkFiles$.value;
		const checkFile = savedFiles.find(
			(file) => file.uniqId === newFile.uniqId
		);

		if (newFile.checked && !checkFile) {
			savedFiles.push(newFile);
		} else {
			savedFiles = savedFiles.map((file) => {
				if (file.uniqId === newFile.uniqId) {
					file.checked = false;
				}

				return file;
			});
		}

		this.checkFiles$.next(savedFiles.filter((x) => x.checked));
	}

	dropFile(dropFile: IFilesProposals) {
		const files = this.checkFiles$.value;
		const walkerFile = files.find(
			(file) => file.uniqId === dropFile.uniqId
		);

		if (walkerFile) {
			const newFileArr = files.filter(
				(item) => item.uniqId !== walkerFile.uniqId
			);

			this.checkFiles$.next(newFileArr);
		}
	}

	dropAll() {
		this.checkFiles$.next([]);
	}
}
