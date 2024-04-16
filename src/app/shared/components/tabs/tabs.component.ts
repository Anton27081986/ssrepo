import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
	selector: 'ss-tabs',
	templateUrl: './tabs.component.html',
	styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent {
	@Input() tabs?: string[] = [];
	@Input() selectedTab: string = 'Все';
	@Output() select = new EventEmitter<string>();

	public onSelect(tab: string) {
		this.selectedTab = tab;
		this.select.emit(tab);
	}

	public trackBy(_index: number, item: any) {
		return item.id;
	}
}
