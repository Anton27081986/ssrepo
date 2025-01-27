import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PlanDaysFiltersIFilter } from '@app/pages/production-plan/constants/plan-days-filters';
import {TextComponent} from "@app/shared/components/typography/text/text.component";
import {TagComponent} from "@app/shared/components/tag/tag.component";
import {TooltipMenuComponent} from "@app/shared/components/tooltip-menu/tooltip-menu.component";
import {CaptionComponent} from "@app/shared/components/typography/caption/caption.component";
import {DropdownButtonComponent} from "@app/shared/components/buttons/dropdown-button/dropdown-button.component";
import {FiltersComponent} from "@app/shared/components/filters/filters.component";
import {CommonModule} from "@angular/common";

@Component({
	selector: 'app-plan-days',
	standalone: true,
	imports: [
		CommonModule,
		TextComponent,
		TagComponent,
		TooltipMenuComponent,
		CaptionComponent,
		DropdownButtonComponent,
		FiltersComponent,
	],
	templateUrl: './plan-days.component.html',
	styleUrl: './plan-days.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanDaysComponent {
	public planDaysFiltersIFilter = PlanDaysFiltersIFilter;
}
