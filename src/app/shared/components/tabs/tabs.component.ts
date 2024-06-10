import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ITab } from '@app/shared/components/tabs/tab';

@UntilDestroy()
@Component({
	selector: 'ss-tabs',
	templateUrl: './tabs.component.html',
	styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent {
	@Input() public tabs?: ITab[] = [];
	@Input() public selectedTab: ITab = { name: 'Все', isVisible: true } as ITab;
	@Output() public select = new EventEmitter<string>();

	public onSelect(tab: ITab) {
		this.selectedTab = tab;
		this.select.emit(tab!.name!);
	}

	public trackBy(_index: number, item: any) {
		return item.name;
	}
}
