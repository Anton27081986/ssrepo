import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
	IconComponent,
	IconType,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-library/components';

@Component({
	selector: 'app-notification',
	imports: [IconComponent, TextComponent],
	templateUrl: './notification.component.html',
	styleUrl: './notification.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {
	public readonly icon = input<IconType>(IconType.Alert);
	public readonly title = input<string>('');
	public readonly description = input<string>('');

	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly IconType = IconType;
}
