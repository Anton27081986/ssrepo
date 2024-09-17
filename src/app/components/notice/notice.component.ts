import { booleanAttribute, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'app-notice',
	templateUrl: './notice.component.html',
	styleUrls: ['./notice.component.scss'],
})
export class NoticeComponent implements OnInit {
	@Input()
	public type: 'ok' | 'error' | 'warning' = 'ok';

	@Input({ transform: booleanAttribute })
	public isLabeled: boolean = true;

	@Input()
	public title: string | undefined;

	@Input()
	public size: 'small' | 'usual' | 'big' = 'usual';

	@Input()
	public text: string | undefined;

	@Output() public close = new EventEmitter<any>();

	public sizeText: '1' | '3' = '1';

	ngOnInit() {
		if (this.size === 'small') {
			this.sizeText = '3';
		}
	}

	closeNotice() {
		this.close.emit();
	}
}
