import { UntilDestroy } from '@ngneat/until-destroy';
import {
	ChangeDetectionStrategy,
	Component,
	input,
	InputSignal,
} from '@angular/core';
import { rotateAnimation } from '@app/core/animations';
import {
	TextComponent,
	TextType,
	TextWeight,
} from '@front-components/components';

@UntilDestroy()
@Component({
	selector: 'tr[loader-tr]',
	templateUrl: './loader-tr.component.html',
	styleUrls: ['./loader-tr.component.scss'],
	standalone: true,
	animations: [rotateAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TextComponent],
})
export class LoaderTrComponent {
	public countCol: InputSignal<number> = input.required<number>();
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
}
