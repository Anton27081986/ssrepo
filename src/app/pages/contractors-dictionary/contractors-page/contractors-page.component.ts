import {
	ChangeDetectionStrategy,
	Component,
	inject,
	Signal,
} from '@angular/core';
import { ContractorsService } from '@app/pages/contractors-dictionary/services/contractors.service';
import { ContractorsItemDto } from '@app/pages/contractors-dictionary/models/contractors-item-dto';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import {
	ButtonComponent,
	ButtonType,
	DividerComponent,
	ExtraSize,
	IconType,
	SsTableState,
	TabsComponent,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-library/components';
import { ContractorsTableComponent } from '@app/pages/contractors-dictionary/contractors-page/contractors-table/contractors-table.component';
import { DropdownColumnsSettingsComponent } from '@app/pages/production-plan/operational-plan/dropdown-column-settings/dropdown-columns-settings.component';
import { FiltersTriggerButtonComponent } from '@app/pages/production-plan/blunt-components/filters-trigger-button/filters-trigger-button.component';
import { Tab } from '@front-library/components/lib/shared/models/interfaces/tab';

@Component({
	selector: 'app-contractors-page',
	templateUrl: './contractors-page.component.html',
	styleUrls: ['./contractors-page.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	providers: [SsTableState],
	imports: [
		ContractorsTableComponent,
		TextComponent,
		ButtonComponent,
		DividerComponent,
		DropdownColumnsSettingsComponent,
		FiltersTriggerButtonComponent,
		TabsComponent,
	],
})
export class ContractorsPageComponent {
	private service: ContractorsService = inject(ContractorsService);

	protected items: Signal<ContractorsItemDto[]> = toSignal(
		this.service.getContractors().pipe(
			map((res) => {
				return res.items;
			})
		),
		{ initialValue: [] }
	);

	protected tabs: Tab[] = [
		{
			text: 'Все',
			isVisible: true,
			isDisabled: false,
		},
		{
			text: 'Архив',
			isVisible: true,
			isDisabled: false,
		},
		{
			text: 'Моя виза',
			isVisible: true,
			isDisabled: false,
		},
	];

	constructor() {}

	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly ButtonType = ButtonType;
	protected readonly ExtraSize = ExtraSize;
	protected readonly IconType = IconType;
}
