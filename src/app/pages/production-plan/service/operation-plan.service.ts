import { inject, Injectable } from '@angular/core';
import { OperationPlanApiService } from '@app/pages/production-plan/service/operation-plan.api-service';
import { map, Observable, of, merge, switchMap } from 'rxjs';
import { environment } from '@environments/environment';
import { IDictionaryItemDto } from '@front-library/components';
import { ManufacturingTovs } from '@app/core/models/operation-plan/manufacturing-tovs';
import {
	TransferProductionPlanFromBackend,
	TransferProductionPlanMap,
	TransferProductionPlanPatch,
} from '@app/core/models/operation-plan/transfer-production-plan-from-backend';
import { FormControl } from '@angular/forms';
import { IResponse } from '@app/core/utils/response';
import { AddToVRequest } from '@app/core/models/operation-plan/add-tov-request';

@Injectable({ providedIn: 'root' })
export class OperationPlanService {
	private operationPlanApiService: OperationPlanApiService = inject(
		OperationPlanApiService,
	);

	public getTransferProductionPlan(
		id: number,
	): Observable<IResponse<TransferProductionPlanMap>> {
		return this.operationPlanApiService.getTransferProductionPlan(id).pipe(
			map((res) => {
				return this.mapIResponse(res);
			}),
		);
	}

	public transferProductionPlan(
		params: TransferProductionPlanMap[],
	): Observable<void> {
		const mapParams: TransferProductionPlanPatch[] = params.map((item) => {
			return {
				orderId: item.orderId,
				productionDate:
					item.productionDateControl.value?.toISOString()!,
				quantity: item.countForPostpone.value!,
			};
		});
		return this.operationPlanApiService.transferProductionPlan(mapParams);
	}

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

	public getManufacturingTov(
		query: string,
		limit: number,
		offset: number,
	): Observable<IResponse<ManufacturingTovs>> {
		return this.operationPlanApiService.getManufacturingTov(
			query,
			limit,
			offset,
		);
	}

	private mapIResponse(
		input: IResponse<TransferProductionPlanFromBackend>,
	): IResponse<TransferProductionPlanMap> {
		const mappedItems = input.items.map((item) => ({
			orderId: item.orderId,
			customerUser: item.customerUser,
			quantity: item.quantity,
			countForPostpone: new FormControl<number | null>(item.quantity),
			productionDateControl: new FormControl<Date | null>(
				new Date(item.productionDate),
			),
		}));

		return {
			items: mappedItems,
			total: input.total,
			totalQuantity: input.totalQuantity,
			linkToModule: input.linkToModule,
		};
	}

	public addGp(params: AddToVRequest[]) {
		return this.operationPlanApiService.addGp(params);
	}
}
