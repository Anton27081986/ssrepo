import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProductionPlanTabs } from '@app/pages/production-plan/constants/production-plan-links';
import { RouterOutlet } from '@angular/router';
import {HeadlineComponent} from "@app/shared/components/typography/headline/headline.component";
import {SelectComponent} from "@app/shared/components/select/select.component";
import {TabsComponent} from "@app/shared/components/tabs/tabs.component";
import {CardComponent} from "@app/shared/components/card/card.component";

@Component({
	selector: 'app-plan-days',
	standalone: true,
	imports: [RouterOutlet, HeadlineComponent, SelectComponent, TabsComponent, CardComponent],
	templateUrl: './production-plan.component.html',
	styleUrl: './production-plan.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductionPlanComponent {
	public readonly productionPlanTabs = ProductionPlanTabs;
}
