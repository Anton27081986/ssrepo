import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProductionPlanTabs } from '@app/pages/production-plan/constants/production-plan-links';
import { RouterOutlet } from '@angular/router';
import { HeadlineModule } from '@app/shared/components/typography/headline/headline.module';
import { SelectModule } from '@app/shared/components/select/select.module';
import { CardModule } from '@app/shared/components/card/card.module';
import { TabsModule } from '@app/shared/components/tabs/tabs.module';

@Component({
	selector: 'app-plan-days',
	standalone: true,
	imports: [RouterOutlet, HeadlineModule, SelectModule, CardModule, TabsModule],
	templateUrl: './production-plan.component.html',
	styleUrl: './production-plan.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductionPlanComponent {
	public readonly productionPlanTabs = ProductionPlanTabs;
}
