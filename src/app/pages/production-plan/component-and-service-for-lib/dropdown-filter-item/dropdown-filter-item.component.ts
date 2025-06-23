import {
	ChangeDetectionStrategy,
	Component,
	input,
	InputSignal,
	model,
	ModelSignal,
} from '@angular/core';
import {
	ButtonComponent,
	CheckboxComponent,
	Colors,
	DropdownListComponent,
	ExtraSize,
	IconComponent,
	PopoverTriggerForDirective,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-library/components';
import { NgComponentOutlet } from '@angular/common';
import { rotateAnimation } from '@app/core/animations';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'ss-lib-dropdown-filter-item',
	standalone: true,
	imports: [
		ButtonComponent,
		DropdownListComponent,
		PopoverTriggerForDirective,
		NgComponentOutlet,
		IconComponent,
		CheckboxComponent,
		TextComponent,
		ReactiveFormsModule,
	],
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

	protected checkItem() {
		this.control().setValue(!this.control().value);
	}
}
