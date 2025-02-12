import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	EventEmitter,
	input,
	InputSignal,
	OnInit,
	Output,
	signal,
	Signal,
} from '@angular/core';

@Component({
	selector: 'ss-dynamic-pagination',
	templateUrl: './dynamic-pagination.component.html',
	styleUrls: ['./dynamic-pagination.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicPaginationComponent implements OnInit {
	@Output() public changeOffset: EventEmitter<number> = new EventEmitter<number>();
	public total: InputSignal<number> = input.required<number>();
	public limit: InputSignal<number> = input.required<number>();
	public offset: InputSignal<number> = input.required<number>();
	public remainder = computed(() => {
		if (this.limit() > this.total()) {
			return this.limit() - this.total();
		}
		return this.limit();
	});

	ngOnInit() {}

	nextOffset() {
		this.changeOffset.emit(this.offset() + this.limit());
	}
}
