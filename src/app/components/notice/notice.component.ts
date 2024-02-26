import {booleanAttribute, Component, Input} from '@angular/core';

@Component({
	selector: 'app-notice',
	templateUrl: './notice.component.html',
	styleUrls: ['./notice.component.scss'],
})
export class NoticeComponent {
	@Input()
	public type: 'ok' | 'error' | 'warning' = 'ok';

	@Input({transform: booleanAttribute})
	public isLabeled: boolean = true;

	@Input()
	public title: string | undefined;

	@Input()
	public text: string | undefined;

}
