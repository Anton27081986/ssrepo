import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
	selector: 'ss-pagination',
	templateUrl: './pagination.component.html',
	styleUrls: ['./pagination.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent implements OnInit, OnChanges {
	@Input({ required: true }) public total: number = 0;
	@Input({ required: true }) public pageIndex: number = 1;
	@Input({ required: true }) public pageSize: number = 0;
	@Output() public changeIndex: EventEmitter<number> = new EventEmitter<number>();
	protected arrTabs: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
	protected countViewTabs: number = 5;
	protected countAllTabs: number = 0;
	protected viewFirstWaiting: boolean = false;
	protected viewLastWaiting: boolean = false;
	protected disabledLeft: boolean = false;
	protected disabledRight: boolean = false;

	ngOnInit() {
		this.countAllTabs = Math.ceil(this.total / this.pageSize);
		this.buildPaginationTabs(this.pageIndex);
	}

	private buildPaginationTabs(walker: number) {
		this.disabledLeft = this.pageIndex !== 1;
		this.disabledRight = this.pageIndex !== this.countAllTabs;

		if (this.countAllTabs <= this.countViewTabs) {
			this.viewLastWaiting = false;
			this.viewFirstWaiting = false;
			this.arrTabs.next(this.buildArrTabs(1, this.countAllTabs - 1));
		} else if (this.countAllTabs > this.countViewTabs) {
			const arr: number[] = this.buildArrTabs(1, this.countAllTabs - 1);

			if (Math.ceil(this.countAllTabs / 3) > 2) {
				const lastPath = arr.slice(this.countAllTabs - 3, this.countAllTabs);
				const firstPath = arr.slice(0, 3);

				this.viewFirstWaiting = false;
				this.viewLastWaiting = false;

				const findFirstPath = firstPath.find(item => item === walker);

				if (findFirstPath) {
					this.viewLastWaiting = true;
					this.arrTabs.next(
						this.buildArrTabs(firstPath[0], firstPath[firstPath.length - 1] + 1),
					);
				} else {
					this.viewFirstWaiting = true;
					this.viewLastWaiting = true;
					this.arrTabs.next(this.buildArrTabs(walker, walker));
				}

				const findLastPath = lastPath.find(item => item === walker);

				if (findLastPath) {
					this.viewLastWaiting = false;
					this.arrTabs.next(
						this.buildArrTabs(lastPath[0] - 1, lastPath[firstPath.length - 1]),
					);
				} else if (!findFirstPath) {
					this.viewLastWaiting = true;
					this.arrTabs.next(this.buildArrTabs(walker - 1, walker));
				}
			} else if (Math.ceil(this.countAllTabs / 3) <= 2) {
				this.arrTabs.next(arr);
			}
		}
	}

	private buildArrTabs(startIndex: number, limit: number): number[] {
		const arr: number[] = [];

		arr.push(startIndex);

		for (let i = startIndex; i <= limit; i++) {
			if (i > this.countAllTabs - 1) {
				break;
			}

			arr.push(i + 1);
		}

		return arr;
	}

	ngOnChanges(change: SimpleChanges): void {
		if (change.total) {
			this.countAllTabs = Math.ceil(this.total / this.pageSize);
			this.buildPaginationTabs(this.pageIndex);
		}
	}

	protected changePageIndex(index: number) {
		this.pageIndex = index;
		this.buildPaginationTabs(this.pageIndex);
		this.changeIndex.emit(index);
	}

	protected back() {
		if (this.disabledLeft) {
			this.pageIndex -= 1;
			this.buildPaginationTabs(this.pageIndex);
			this.changeIndex.emit(this.pageIndex);
		}
	}

	protected next() {
		if (this.disabledRight) {
			this.pageIndex += 1;
			this.buildPaginationTabs(this.pageIndex);
			this.changeIndex.emit(this.pageIndex);
		}
	}
}
