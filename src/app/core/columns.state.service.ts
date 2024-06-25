import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { IStoreTableBaseColumn } from '@app/core/store';

@Injectable()
export class ColumnsStateService {
	public readonly cols$: BehaviorSubject<IStoreTableBaseColumn[] | null> = new BehaviorSubject<
		IStoreTableBaseColumn[] | null
	>(null);

	public readonly visibleCols$: Observable<IStoreTableBaseColumn[] | []>;

	constructor() {
		this.visibleCols$ = this.cols$.pipe(
			map(col => {
				return col
					? col
							?.filter(item => item.show)
							.sort(function (a, b) {
								return a.order - b.order;
							})
					: [];
			}),
		);
	}

	toggleItemShow(id: string) {
		const oldCols = this.cols$.value;

		if (oldCols) {
			this.cols$.next(
				oldCols.map(col => {
					return col.id === id
						? {
								...col,
								show: !col.show,
							}
						: col;
				}),
			);
		}
	}
}
