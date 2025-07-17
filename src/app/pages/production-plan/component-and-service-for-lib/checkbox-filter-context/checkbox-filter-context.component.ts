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
	Align,
	Colors,
	DropdownFilterItemComponent,
	FieldCtrlDirective,
	FormFieldComponent,
	IconType,
	InputComponent,
	SpinnerComponent,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-library/components';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';

@Component({
	selector: 'ss-lib-checkbox-filter-context',
	standalone: true,
	imports: [
		FormFieldComponent,
		InputComponent,
		FieldCtrlDirective,
		SpinnerComponent,
		NgIf,
		DropdownFilterItemComponent,
		NgFor,
		TextComponent,
		AsyncPipe,
		ReactiveFormsModule,
	],
	templateUrl: './checkbox-filter-context.component.html',
	styleUrl: './checkbox-filter-context.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [],
})
export class CheckboxFilterContextComponent {
	public controlsMap: InputSignal<{
		[id: number]: FormControl<boolean | null>;
	}> = input.required();

	public items: InputSignal<IDictionaryItemDto[]> = input.required();
	public isLoader: InputSignal<boolean> = input.required();
	public controlClearAll: InputSignal<FormControl<boolean | null>> =
		input.required();

	public queryControl: InputSignal<FormControl<string | null>> =
		input.required();

	public indeterminate: ModelSignal<boolean> = model(false);
	protected readonly IconType = IconType;
	protected readonly Colors = Colors;
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly Align = Align;

	public get trueCheckControlMap(): boolean {
		return (
			Object.values(this.controlsMap()).some(
				(control) => control.value === true,
			) && this.indeterminate()
		);
	}
}
