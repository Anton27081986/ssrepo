import { Component } from '@angular/core';
import { ColumnsStateService } from '@app/core/columns.state.service';
import { IStoreTableBaseColumn } from '@app/core/store';

@Component({
	selector: 'ss-settings-view-column',
	styleUrls: ['settings-view-column.component.scss'],
	templateUrl: './settings-view-column.component.html',
})
export class SettingsViewColumnComponent {
	constructor(protected readonly state: ColumnsStateService) {}

	public toggleItemShow(item: IStoreTableBaseColumn): void {
		this.state.toggleItemShow(item);
	}
}
