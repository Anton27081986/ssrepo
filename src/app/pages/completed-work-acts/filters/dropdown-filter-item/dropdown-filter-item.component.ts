import {
	ChangeDetectionStrategy,
	Component,
	input,
	InputSignal,
	model,
	ModelSignal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
	CheckboxComponent,
	Colors,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-library/components';
import { rotateAnimation } from '@app/core/animations';

@Component({
	selector: 'ss-lib-dropdown-filter-item',
	standalone: true,
	imports: [CheckboxComponent, TextComponent, ReactiveFormsModule],
	templateUrl: './dropdown-filter-item.component.html',
	styleUrl: './dropdown-filter-item.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [rotateAnimation],
})
export class DropdownFilterItemComponent {
	public control: InputSignal<FormControl<boolean | null>> = input.required();
	public text: InputSignal<string> = input.required();
	public isPaddingLeft: InputSignal<boolean> = input(false);
	public indeterminate: ModelSignal<boolean> = model(false);

	protected checkItem(): void {
		this.control().setValue(!this.control().value);
	}

	protected readonly TextWeight = TextWeight;
	protected readonly TextType = TextType;
	protected readonly Colors = Colors;
}
