import { booleanAttribute, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'app-notice',
	templateUrl: './notice.component.html',
	styleUrls: ['./notice.component.scss'],
})
export class NoticeComponent {
	@Input()
	public type: 'ok' | 'error' | 'warning' = 'ok';

	@Input({ transform: booleanAttribute })
	public isLabeled: boolean = true;

	@Input()
	public title: string | undefined;

	@Input()
	public text: string | undefined;

	@Output() public close = new EventEmitter<any>();

	closeNotice() {
		this.close.emit();
	}
}
