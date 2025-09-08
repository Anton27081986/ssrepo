import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import {
	AvatarComponent,
	BadgeComponent,
	ButtonComponent,
	ButtonType,
	Colors,
	DropdownItemComponent,
	DropdownListComponent,
	ExtraSize,
	IconComponent,
	IconPosition,
	IconType,
	PopoverTriggerForDirective,
	TabsComponent,
	TagComponent,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-library/components';
import { Tab } from '@front-library/components/lib/shared/models/interfaces/tab';

interface RoutedTab extends Tab {
	route: string;
}
@Component({
	selector: 'app-contractor-card',
	templateUrl: './contractor-card.component.html',
	styleUrls: ['./contractor-card.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		TextComponent,
		AvatarComponent,
		BadgeComponent,
		TagComponent,
		ButtonComponent,
		DropdownListComponent,
		PopoverTriggerForDirective,
		DropdownItemComponent,
		IconComponent,
		TabsComponent,
		RouterOutlet,
	],
})
export class ContractorCardComponent {
	public contractorId?: string;
	public tabs: RoutedTab[] = [
		{
			text: 'Общая информация',
			isVisible: true,
			isDisabled: false,
			route: 'basic',
		},
		{
			text: 'Договоры и счета',
			isVisible: true,
			isDisabled: false,
			route: 'contracts',
		},
		{
			text: 'Контакты',
			isVisible: true,
			isDisabled: false,
			route: 'contacts',
		},
		{
			text: 'Благодарности',
			isVisible: true,
			isDisabled: false,
			route: 'thanks',
		},
		{
			text: 'Документы',
			isVisible: true,
			isDisabled: false,
			route: 'docs',
		},
		{
			text: 'Модель клиента',
			isVisible: true,
			isDisabled: false,
			route: 'model',
		},
		{
			icon: IconType.Info,
			text: 'Переписка',
			isVisible: true,
			isDisabled: false,
			route: 'correspondence',
		},
	];

	public indexTab = 0;

	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly ExtraSize = ExtraSize;
	protected readonly IconType = IconType;
	protected readonly Colors = Colors;
	protected readonly ButtonType = ButtonType;
	protected readonly IconPosition = IconPosition;
	constructor(
		private readonly activatedRoute: ActivatedRoute,
		private readonly router: Router
	) {
		const id = this.activatedRoute.snapshot.paramMap.get('id');

		if (id) {
			this.contractorId = id;

			const tabUrl = this.router.url.split('/').pop();

			this.indexTab = this.tabs.findIndex((el) => el.route === tabUrl);
		}
	}

	public changeTab(index: number): void {
		this.indexTab = index;
		const tab = this.tabs[index];
		const urlParts = this.router.url.split('/');

		urlParts.pop();
		urlParts.push(tab?.route || 'basic');

		this.router.navigate([urlParts.join('/')]);
	}
}
