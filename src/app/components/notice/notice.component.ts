import { booleanAttribute, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {NzIconDirective} from "ng-zorro-antd/icon";
import {TextComponent} from "@app/shared/components/typography/text/text.component";
import {IconComponent} from "@app/shared/components/icon/icon.component";
import {NgIf} from "@angular/common";

@Component({
	selector: 'app-notice',
	templateUrl: './notice.component.html',
	styleUrls: ['./notice.component.scss'],
	imports: [
		NzIconDirective,
		TextComponent,
		IconComponent,
		NgIf
	],
	standalone: true
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

	@Output()
	public close = new EventEmitter<void>();

	public sizeText: '1' | '3' = '1';

	public ngOnInit() {
		if (this.size === 'small') {
			this.sizeText = '3';
		}
	}

	public closeNotice() {
		this.close.emit();
	}
}
