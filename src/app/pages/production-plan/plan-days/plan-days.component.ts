import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CardModule } from '@app/shared/components/card/card.module';
import { ButtonModule } from '@app/shared/components/buttons/button/button-module';
import { CaptionModule } from '@app/shared/components/typography/caption/caption.module';
import { IconModule } from '@app/shared/components/icon/icon.module';
import { TooltipMenuModule } from '@app/shared/components/tooltip-menu/tooltip-menu.module';
import { TagModule } from '@app/shared/components/tag/tag.module';
import { TextModule } from '@app/shared/components/typography/text/text.module';
import { FiltersModule } from '@app/shared/components/filters/filters.module';
import { PlanDaysFiltersIFilter } from '@app/pages/production-plan/constants/plan-days-filters';
import { DropdownButtonModule } from '@app/shared/components/buttons/dropdown-button/dropdown-button.module';

@Component({
	selector: 'app-plan-days',
	standalone: true,
	imports: [
		CardModule,
		ButtonModule,
		CaptionModule,
		IconModule,
		TooltipMenuModule,
		TagModule,
		TextModule,
		FiltersModule,
		DropdownButtonModule,
	],
	templateUrl: './plan-days.component.html',
	styleUrl: './plan-days.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanDaysComponent {
	public planDaysFiltersIFilter = PlanDaysFiltersIFilter;
}
