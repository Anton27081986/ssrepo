import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import {CaptionComponent} from "@app/shared/components/typography/caption/caption.component";
import {CommonModule, NgClass} from "@angular/common";
import {TextComponent} from "@app/shared/components/typography/text/text.component";
import {IconComponent} from "@app/shared/components/icon/icon.component";

@UntilDestroy()
@Component({
	selector: 'ss-chips-search-v2',
	templateUrl: './chips-search-v2.component.html',
	styleUrls: ['./chips-search-v2.component.scss'],
	imports: [
		CommonModule,
		CaptionComponent,
		NgClass,
		TextComponent,
		IconComponent
	],
	standalone: true
})
export class ChipsSearchV2Component {
	@Input() public size: 'large' | 'medium' = 'medium';
	@Input() public disabled: boolean = false;
	@Input() public label: string | undefined;
	@Input() public placeholder: string = '';
	@Input() public error: string | undefined;
	@Input() public selectedItems: any[] = [];

	@Output() public getSelected = new EventEmitter<any>();

	@ViewChild('input') public input!: ElementRef;

	protected found: any[] = [];

	public constructor() {}

	protected onAddItemToList(item: any) {
		this.selectedItems.push(item);
		this.found = [];
		setTimeout(() => {
			this.input.nativeElement.value = '';
			this.input.nativeElement.focus();
			this.getSelected.emit(this.selectedItems);
		}, 0);
	}

	protected onRemoveItemFromList(i: any) {
		this.selectedItems.splice(i, 1);
		this.getSelected.emit(this.selectedItems);
	}

	protected dontSend(event: any): any {
		const key = event.which || event.keyCode;

		if (key === 13) {
			return false;
		}
	}
}
