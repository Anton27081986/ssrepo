import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeadlineComponent } from '@app/shared/components/typography/headline/headline.component';
import { SelectComponent } from '@app/shared/components/select/select.component';
import { TabsComponent } from '@app/shared/components/tabs/tabs.component';
import { CardComponent } from '@app/shared/components/card/card.component';
import { ButtonComponent } from '@front-library/components';

@Component({
	selector: 'app-plan-days',
	standalone: true,
	imports: [
		HeadlineComponent,
		SelectComponent,
		TabsComponent,
		CardComponent,
		ButtonComponent,
	],
	templateUrl: './production-plan.component.html',
	styleUrl: './production-plan.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductionPlanComponent {}
