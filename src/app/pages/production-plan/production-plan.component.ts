import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	inject,
} from '@angular/core';
import {
	ButtonComponent,
	ButtonType,
	DropdownItemComponent,
	DropdownListComponent,
	ExtraSize,
	IconType,
	PopoverTriggerForDirective,
	TabsComponent,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-library/components';
import { IconPosition } from '@front-components/components';
import { RouterOutlet } from '@angular/router';
import { environment } from '@environments/environment';
import { OperationPlanPopupService } from '@app/pages/production-plan/service/operation-plan.popup.service';
import { OperationPlanService } from '@app/pages/production-plan/service/operation-plan.service';
import { OperationPlanState } from '@app/pages/production-plan/service/operation-plan.state';
import { Tab } from '@front-library/components/lib/shared/models/interfaces/tab';
import { NgIf } from '@angular/common';
import { timer, take } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@Component({
	selector: 'app-plan-days',
	standalone: true,
	imports: [
		ButtonComponent,
		TextComponent,
		RouterOutlet,
		PopoverTriggerForDirective,
		DropdownListComponent,
		DropdownItemComponent,
		TabsComponent,
		NgIf,
	],
	templateUrl: './production-plan.component.html',
	styleUrl: './production-plan.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [OperationPlanState],
})
@UntilDestroy()
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
			icon: IconType.LinkExternal01,
		},
		{
			text: 'Недельный план ТМЗ',
			isDisabled: false,
			isVisible: true,
			icon: IconType.LinkExternal01,
		},
		{
			text: 'Недельный расчет сырья',
			isDisabled: false,
			isVisible: true,
			icon: IconType.LinkExternal01,
		},
	];

	protected readonly ExtraSize = ExtraSize;
	protected readonly ButtonType = ButtonType;
	protected readonly IconPosition = IconPosition;
	private readonly operationPlanPopupService: OperationPlanPopupService =
		inject(OperationPlanPopupService);

	protected operationPlanState: OperationPlanState =
		inject(OperationPlanState);

	protected changeRef: ChangeDetectorRef = inject(ChangeDetectorRef);

	private readonly weekId$ = this.operationPlanState.weekId$;

	private readonly productionPlanService: OperationPlanService =
		inject(OperationPlanService);

	// Конфигурация действий для вкладок (индекс -> действие)
	protected tabActions: Array<null | {
		prodUrl: string;
		devUrl: string;
		resetTab: boolean;
	}> = [
		null, // 0 — локальная вкладка, ничего не делаем
		{
			prodUrl: 'https://cisp.ssnab.ru/Ss/Mfs/Plan/PlanDaysRaw.aspx',
			devUrl: 'https://ssnab.it/Ss/Mfs/Plan/PlanDaysRaw.aspx',
			resetTab: true,
		},
		{
			prodUrl: 'https://cisp.ssnab.ru/pmt/#!/mfsorders/planMTMZ',
			devUrl: 'https://test.ssnab.ru/pmt/#!/mfsorders/planMTMZ',
			resetTab: true,
		},
		{
			prodUrl: 'https://cisp.ssnab.ru/pmt/#!/mfsorders/planMPO',
			devUrl: 'https://test.ssnab.ru/pmt/#!/mfsorders/planMPO',
			resetTab: true,
		},
	];

	protected changeTabIndex(index: number): void {
		const action = this.tabActions[index];

		if (action) {
			const url = environment.production ? action.prodUrl : action.devUrl;

			timer(250)
				.pipe(take(1), untilDestroyed(this))
				.subscribe(() => {
					if (action.resetTab) {
						this.activeTabIndex = 0;
						this.changeRef.detectChanges();
					}
				}); // возвращает в 0 таб , так как временно клик по табу это переход по ссылке

			window.open(url, '_blank');
		} else {
			this.activeTabIndex = index;
		}
	}

	protected addSemiManufactures(): void {
		const weekId = this.weekId$.value;

		if (weekId !== null) {
			this.operationPlanPopupService.addSemiManufactures(weekId);
		}
	}

	protected upload1C(): void {
		const weekId = this.operationPlanState.weekId$.value!;

		this.productionPlanService.upload1C(weekId).subscribe((value) => {
			window.open(value.linkToModule, '_blank');
		});
	}

	protected downloadReport(): void {
		this.productionPlanService.downloadReport().subscribe((value) => {
			window.open(value.linkToModule, '_blank');
		});
	}

	protected downloadExel(): void {
		const filters = this.operationPlanState.filterValueStore$.value!;

		this.productionPlanService.downloadExel(filters).subscribe((blob) => {
			const fileURL = window.URL.createObjectURL(blob);
			const link = document.createElement('a');

			link.href = fileURL;
			link.click();

			window.URL.revokeObjectURL(fileURL);
		});
	}
}
