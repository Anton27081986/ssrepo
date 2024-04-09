import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
	selector: 'ss-tabs',
	templateUrl: './tabs.component.html',
	styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {
	@Input() tabs?: string[] = [];
	@Input() asyncTabs?: Observable<string[]> = new BehaviorSubject(['Все']);
	@Output() select = new EventEmitter<string>();

	protected selectedTabs: Array<{ name: string; isSelected: boolean }> = [];

	public ngOnInit() {
		if (this.tabs?.length) {
			this.initTabs(this.tabs);
			return
		}

		if (this.asyncTabs) {
			this.asyncTabs.pipe().subscribe(tabs => {
				this.initTabs(tabs);
			});
		}
	}

	private initTabs(tabs: string[]) {
		this.selectedTabs = tabs.map(tab => {
			return {
				name: tab,
				isSelected: false,
			};
		});
		this.selectedTabs[0].isSelected = true;
	}

	public onSelect(name: string) {
		this.selectedTabs.forEach(tab => {
			if (tab.name === name) {
				tab.isSelected = true;
			} else {
				tab.isSelected = false;
			}
		});
		this.select.emit(name);
	}

	public trackBy(_index: number, item: any) {
		return item.id;
	}
}
