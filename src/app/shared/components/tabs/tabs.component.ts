import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ITab } from '@app/shared/components/tabs/tab';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {TextComponent} from "@app/shared/components/typography/text/text.component";

@UntilDestroy()
@Component({
	selector: 'ss-tabs',
	templateUrl: './tabs.component.html',
	styleUrls: ['./tabs.component.scss'],
	imports: [
		NgClass,
		NgForOf,
		NgIf,
		TextComponent
	],
	standalone: true
})
export class TabsComponent {
	@Input() public tabs?: ITab[] = [];
	@Input() public selectedTab: ITab = { name: 'Все', isVisible: true } as ITab;
	@Input() public size: 'small' | 'medium' | 'big' = 'small';
	@Input() public tabsBorder = true;
	@Output() public select = new EventEmitter<string>();

	public onSelect(tab: ITab) {
		this.selectedTab = tab;
		this.select.emit(tab!.name!);
	}

	public trackBy(_index: number, item: any) {
		return item.name;
	}
}
