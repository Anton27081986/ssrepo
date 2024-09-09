import { UntilDestroy } from '@ngneat/until-destroy';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IFilterOption } from '@app/shared/components/filters/filters.component';
import { TooltipPosition, TooltipTheme } from '@app/shared/components/tooltip/tooltip.enums';

@UntilDestroy()
@Component({
	selector: 'ss-multiselect-chips-v2',
	templateUrl: './multiselect-chips-v2.component.html',
	styleUrls: ['./multiselect-chips-v2.component.scss'],
})
export class MultiselectChipsV2Component {
	@Input() public chips: IFilterOption[] = [];
	@Input() public ellipsis = false;
	@Output() public delChipEmit = new EventEmitter<IFilterOption>();

	protected getChips() {
		if (this.chips.length > 3) {
			this.chips = this.chips.slice(0, 3);
		}

		return this.chips;
	}

	protected deleteChipEmit(chip: IFilterOption) {
		this.delChipEmit.emit(chip);
	}

	protected readonly TooltipPosition = TooltipPosition;
	protected readonly TooltipTheme = TooltipTheme;
}
