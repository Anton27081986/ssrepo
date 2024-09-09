import { UntilDestroy } from '@ngneat/until-destroy';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IFilterOption } from '@app/shared/components/filters/filters.component';

@UntilDestroy()
@Component({
	selector: 'ss-multiselect-option-v2',
	templateUrl: './multiselect-option-v2.component.html',
	styleUrls: ['./multiselect-option-v2.component.scss'],
})
export class MultiselectOptionV2Component {
	@Input() public option: IFilterOption | null = null;
	@Output() public outPutCheckItems: EventEmitter<any> = new EventEmitter<any>();

	protected checkItems() {
		this.outPutCheckItems.emit();
	}
}
