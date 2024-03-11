import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'app-pagination',
	templateUrl: './pagination.component.html',
	styleUrls: ['./pagination.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
	@Input() total!: number;
	@Input() pageIndex!: number;
	@Input() pageSize!: number;
	@Input() offset!: number;

	nzPageIndexChange($event: number) {
		if ($event === 1) {
			this.offset = 0;
		} else {
			this.offset = this.pageSize * $event - this.pageSize;
		}

		this.pageIndex = $event;
	}
}
