import { UntilDestroy } from '@ngneat/until-destroy';
import { Component, Input } from '@angular/core';
import { IFilterOption } from '@app/shared/components/filters/filters.component';
import { TextComponent } from '@app/shared/components/typography/text/text.component';
import { FormsModule } from '@angular/forms';

@UntilDestroy()
@Component({
	selector: 'ss-multiselect-option-v2',
	templateUrl: './multiselect-option-v2.component.html',
	styleUrls: ['./multiselect-option-v2.component.scss'],
	imports: [TextComponent, FormsModule],
	standalone: true,
})
export class MultiselectOptionV2Component {
	@Input()
	public option: IFilterOption | null = null;

	@Input()
	public disabled = false;
}
