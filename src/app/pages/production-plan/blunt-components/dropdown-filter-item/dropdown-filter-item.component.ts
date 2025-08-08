import {
	ChangeDetectionStrategy,
	Component,
	input,
	InputSignal,
	model,
	ModelSignal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { TextComponent } from '../text/text.component';
import { rotateAnimation } from '../../core/animations';
import { Colors, ExtraSize, TextType, TextWeight } from '../../shared/models';

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
	protected readonly Colors = Colors;
	protected readonly ExtraSize = ExtraSize;
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;

	protected checkItem(): void {
		this.control().setValue(!this.control().value);
	}
}
