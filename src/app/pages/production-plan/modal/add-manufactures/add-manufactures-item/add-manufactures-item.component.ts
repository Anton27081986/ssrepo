import {
	ChangeDetectionStrategy,
	Component,
	input,
	InputSignal,
} from '@angular/core';
import {
	ButtonType,
	CheckboxComponent,
	ExtraSize,
	IconType,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-library/components';
import { IconPosition } from '@front-components/components';
import { ReactiveFormsModule } from '@angular/forms';
import { ManufacturingSelectedTovs } from '@app/core/models/production-plan/manufacturing-tovs';

@Component({
	selector: 'app-add-manufactures-item',
	standalone: true,
	imports: [CheckboxComponent, TextComponent, ReactiveFormsModule],
	templateUrl: './add-manufactures-item.component.html',
	styleUrl: './add-manufactures-item.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddManufacturesItemComponent {
	public readonly item: InputSignal<ManufacturingSelectedTovs> =
		input.required();

	protected readonly IconPosition = IconPosition;
	protected readonly ExtraSize = ExtraSize;
	protected readonly TextType = TextType;
	protected readonly ButtonType = ButtonType;
	protected readonly TextWeight = TextWeight;
	protected readonly IconType = IconType;
}
