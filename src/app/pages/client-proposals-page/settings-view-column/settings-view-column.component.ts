import { Component } from '@angular/core';
import { ColumnsStateService } from '@app/core/columns.state.service';

@Component({
	selector: 'ss-settings-view-column',
	styleUrls: ['settings-view-column.component.scss'],
	templateUrl: './settings-view-column.component.html',
})
export class SettingsViewColumnComponent {
	constructor(protected readonly state: ColumnsStateService) {}

	public toggleItemShow(item: string): void {
		this.state.toggleItemShow(item);
	}
}
