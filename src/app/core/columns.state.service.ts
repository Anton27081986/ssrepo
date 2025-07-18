import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { IStoreTableBaseColumn, ITrTableBaseColumn } from '@app/core/store';

@Injectable({ providedIn: 'root' })
export class ColumnsStateService {
	public readonly colsTr$: BehaviorSubject<ITrTableBaseColumn[]> =
		new BehaviorSubject<ITrTableBaseColumn[]>([]);

	public readonly visibleCols$: Observable<ITrTableBaseColumn[]>;

	constructor() {
		this.visibleCols$ = this.colsTr$.pipe(
			map((col) => {
				const newCol: ITrTableBaseColumn[] = [];

				col.forEach((item) => {
					const filter = item.cols
						.filter((col) => {
							return col.show;
						})
						.sort(function (a, b) {
							return a.order - b.order;
						});

					newCol.push({ cols: filter });
				});

				return newCol;
			})
		);
	}

	toggleItemShow(item: IStoreTableBaseColumn) {
		item.show = !item.show;
		this.colsTr$.next(this.colsTr$.value);
	}
}
