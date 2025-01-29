import { UntilDestroy } from '@ngneat/until-destroy';
import { Component, Input } from '@angular/core';
import { IFilterOption } from '@app/shared/components/filters/filters.component';

@UntilDestroy()
@Component({
	selector: 'ss-multiselect-option-v2',
	templateUrl: './multiselect-option-v2.component.html',
	styleUrls: ['./multiselect-option-v2.component.scss'],
})
export class MultiselectOptionV2Component {
	@Input() public option: IFilterOption | null = null;
	@Input() public disabled: boolean = false;
}
