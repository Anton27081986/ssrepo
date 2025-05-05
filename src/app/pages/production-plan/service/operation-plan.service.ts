import { inject, Injectable } from '@angular/core';
import { OperationPlanApiService } from '@app/pages/production-plan/service/operation-plan.api-service';
import { map, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { IDictionaryItemDto } from '@front-library/components';
import { ManufacturingTovs } from '@app/core/models/operation-plan/manufacturing-tovs';

@Injectable({ providedIn: 'root' })
export class OperationPlanService {
	private operationPlanApiService: OperationPlanApiService = inject(
		OperationPlanApiService,
	);

	public upload1C(weekId: number) {
		if (environment.production) {
			window.open(
				`https://cisp.ssnab.ru/mfs/ouexport#!/index?weekId=${weekId}&sectionId=`,
				'_blank',
			);
		} else {
			window.open(
				`https://ssnab.it/mfs/ouexport#!/index?weekId==${weekId}&sectionId=`,
				'_blank',
			);
		}
	}

	public downloadReport() {
		if (environment.production) {
			window.open(
				'https://cisp.ssnab.ru/Reports/Report/MfsPlanDays',
				'_blank',
			);
		} else {
			window.open(
				'https://ssnab.it/Reports/Report/MfsPlanDays',
				'_blank',
			);
		}
	}

	public downloadExel(): Observable<Blob> {
		return this.operationPlanApiService.downloadExel();
	}

	public getWeeks(): Observable<IDictionaryItemDto[]> {
		return this.operationPlanApiService.getWeeks().pipe(
			map((res) => {
				return res.items;
			}),
		);
	}

	public getManufacturingTov(): Observable<ManufacturingTovs[]> {
		return this.operationPlanApiService.getManufacturingTov().pipe(
			map((item) => {
				return item.items;
			}),
		);
	}
}
