import { Component } from '@angular/core';
import { ColumnsStateService } from '@app/core/columns.state.service';
import { IStoreTableBaseColumn } from '@app/core/store';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {IconComponent} from "@app/shared/components/icon/icon.component";
import {TextComponent} from "@app/shared/components/typography/text/text.component";

@Component({
	selector: 'ss-settings-view-column',
	styleUrls: ['settings-view-column.component.scss'],
	templateUrl: './settings-view-column.component.html',
	imports: [
		NgForOf,
		AsyncPipe,
		IconComponent,
		NgIf,
		TextComponent
	],
	standalone: true
})
export class SettingsViewColumnComponent {
	constructor(protected readonly state: ColumnsStateService) {}

	public toggleItemShow(item: IStoreTableBaseColumn): void {
		this.state.toggleItemShow(item);
	}
}
