import { UntilDestroy } from '@ngneat/until-destroy';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IFilterOption } from '@app/shared/components/filters/filters.component';
import {
	TooltipPosition,
	TooltipTheme,
} from '@app/shared/components/tooltip/tooltip.enums';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { TooltipDirective } from '@app/shared/components/tooltip/tooltip.directive';

@UntilDestroy()
@Component({
	selector: 'ss-multiselect-chips-v2',
	templateUrl: './multiselect-chips-v2.component.html',
	styleUrls: ['./multiselect-chips-v2.component.scss'],
	imports: [IconComponent, TooltipDirective],
	standalone: true,
})
export class MultiselectChipsV2Component {
	@Input()
	public chips: IFilterOption[] = [];

	@Input()
	public ellipsis = false;

	@Input()
	public readOnly = false;

	@Output()
	public delChipEmit = new EventEmitter<IFilterOption>();

	protected readonly TooltipPosition = TooltipPosition;
	protected readonly TooltipTheme = TooltipTheme;
	protected getChips() {
		if (this.chips.length > 3) {
			this.chips = this.chips.slice(0, 3);
		}

		return this.chips;
	}

	protected deleteChipEmit(chip: IFilterOption) {
		if (!this.readOnly) {
			this.delChipEmit.emit(chip);
		}
	}
}
