import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HeadlineComponent } from '@app/shared/components/typography/headline/headline.component';
import { SelectComponent } from '@app/shared/components/select/select.component';
import { CardComponent } from '@app/shared/components/card/card.component';
import {
	ButtonComponent,
	TabsComponent,
	TextComponent,
	TextType,
	TextWeight,
	IconType,
	ExtraSize,
	ButtonType,
	PopoverTriggerForDirective,
	DropdownListComponent,
	DropdownItemComponent,
} from '@front-library/components';
import { Tab } from '@front-library/components/lib/shared/models/interfaces/tab';
import { IconPosition } from '@front-components/components';
import { RouterOutlet } from '@angular/router';
import { environment } from '@environments/environment';
import { OperationPlanPopupService } from '@app/pages/production-plan/service/operation-plan.popup.service';
import { OperationPlanService } from '@app/pages/production-plan/service/operation-plan.service';

@Component({
	selector: 'app-plan-days',
	standalone: true,
	imports: [
		HeadlineComponent,
		SelectComponent,
		TabsComponent,
		CardComponent,
		ButtonComponent,
		TextComponent,
		TabsComponent,
		RouterOutlet,
		PopoverTriggerForDirective,
		DropdownListComponent,
		DropdownItemComponent,
	],
	templateUrl: './production-plan.component.html',
	styleUrl: './production-plan.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [],
})
export class ProductionPlanComponent {
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly IconType = IconType;
	protected activeTabIndex = 0;
	protected tabs: Tab[] = [
		{
			text: 'Оперативный план',
			isVisible: true,
			isDisabled: false,
		},
		{
			text: 'Журнал расчета сырья',
			isDisabled: false,
			isVisible: true,
		},
	];
	protected readonly ExtraSize = ExtraSize;
	protected readonly ButtonType = ButtonType;
	protected readonly IconPosition = IconPosition;
	private operationPlanPopupService: OperationPlanPopupService = inject(
		OperationPlanPopupService,
	);

	private productionPlanService: OperationPlanService =
		inject(OperationPlanService);

	protected changeTabIndex(index: number) {
		if (index === 1) {
			// Костыль пока не появится модуль Журнал расчета сырья
			if (environment.production) {
				window.open(
					'https://cisp.ssnab.ru/Ss/Mfs/Plan/PlanDaysRaw.aspx',
				);
				window.location.reload();
			} else {
				window.open(' https://ssnab.it/Ss/Mfs/Plan/PlanDaysRaw.aspx');
				window.location.reload();
			}
			this.activeTabIndex = 0;
		} else {
			this.activeTabIndex = index;
		}
	}

	protected addSemiManufactures() {
		this.operationPlanPopupService.addSemiManufactures();
	}
	protected upload1C() {
		this.productionPlanService.upload1C(202519);
	}

	protected downloadReport() {
		this.productionPlanService.downloadReport();
	}

	protected downloadExel() {
		this.productionPlanService.downloadExel().subscribe((blob) => {
			const fileURL = window.URL.createObjectURL(blob);
			const link = document.createElement('a');

			link.href = fileURL;
			link.click();

			window.URL.revokeObjectURL(fileURL);
		});
	}
}
