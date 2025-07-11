import { inject, Injectable } from '@angular/core';
import { OperationPlanApiService } from '@app/pages/production-plan/service/operation-plan.api-service';
import { map, Observable, of, tap, merge, switchMap } from 'rxjs';
import { IDictionaryItemDto } from '@front-library/components';
import { ManufacturingTovs } from '@app/core/models/production-plan/manufacturing-tovs';
import {
	TransferProductionPlanFromBackend,
	TransferProductionPlanMap,
	TransferProductionPlanPatch,
} from '@app/core/models/production-plan/transfer-production-plan-from-backend';
import { FormControl } from '@angular/forms';
import { IResponse, ProductionPlanResponse } from '@app/core/utils/response';
import { AddToVRequest } from '@app/core/models/production-plan/add-tov-request';
import {
	OperationPlanItem,
	OperationPlanRequest,
	Pagination,
} from '@app/core/models/production-plan/operation-plan';
import { LinkToModule } from '@app/core/models/production-plan/update-raw-materials-request';
import { ApproveMaterialRequest } from '@app/core/models/production-plan/approve-materials';
import { OrderAnOutfitRequest } from '@app/core/models/production-plan/order-an-outfit-request';
import {
	OperationPlanEventEnum,
	OperationPlanRootService,
} from '@app/pages/production-plan/service/operation-plan.root.service';
import { UpdateRawMaterialsRequest } from '@app/core/models/production-plan/update-raw-materials-request';
import {ICommentsItemDto, ISendComment} from '@app/core/models/production-plan/comments';
import {
    CreatePlanFactRequest,
    UpdatePlanFactRequest,
} from '@app/core/models/production-plan/plan-fact-request';

@Injectable({ providedIn: 'root' })
export class OperationPlanService {
	private readonly operationPlanApiService: OperationPlanApiService = inject(
		OperationPlanApiService,
	);

	private readonly operationPlanRootService: OperationPlanRootService =
		inject(OperationPlanRootService);

	public getProductionPlan(
		request: OperationPlanRequest & Pagination,
	): Observable<ProductionPlanResponse<OperationPlanItem>> {
		return merge(of(void 0), this.operationPlanRootService.event$).pipe(
			switchMap(() => {
				return this.operationPlanApiService.getOperationPlan(request);
			}),
		);
	}

	public getTransferProductionPlan(
		id: number,
	): Observable<IResponse<TransferProductionPlanMap>> {
		return this.operationPlanApiService.getTransferProductionPlan(id).pipe(
			map((res) => {
				return this.mapIResponse(res);
			}),
		);
	}

	public sendComment(id: number, body: ISendComment) {
		return this.operationPlanApiService.sendComment(id, body).subscribe();
	}

	public addComment(id: number): Observable<ICommentsItemDto[]> {
		return this.operationPlanApiService.addComment(id);
	}

	public transferProductionPlan(
		params: TransferProductionPlanMap[],
	): Observable<void> {
		const mapParams: TransferProductionPlanPatch[] = params.map((item) => {
			const date = item.productionDateControl.value;
			const productionDate = date
				? [
						date.getFullYear(),
						String(date.getMonth() + 1).padStart(2, '0'),
						String(date.getDate()).padStart(2, '0'),
					].join('-')
				: '';

			return {
				id: item.id,
				orderId: item.orderId,
				quantity: item.countForPostpone.value!,
				productionDate,
			};
		});

		return this.operationPlanApiService.transferProductionPlan(mapParams);
	}

	public upload1C() {
		return this.operationPlanApiService.upload1C();
	}

	public downloadReport() {
		return this.operationPlanApiService.downloadReport();
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
			id: item.id,
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

	public addGp(params: AddToVRequest) {
		return this.operationPlanApiService.addGp(params).pipe(
			tap(() => {
				this.operationPlanRootService.event$.next({
					type: OperationPlanEventEnum.operationPlanAdd,
				});
			}),
		);
	}

	public deleteItemsTov(tovIds: number[]) {
		return this.operationPlanApiService.deleteItemsTov(tovIds).pipe(
			tap(() => {
				this.operationPlanRootService.event$.next({
					type: OperationPlanEventEnum.operationPlanDelete,
				});
			}),
		);
	}

	public getCalcVariants() {
		return this.operationPlanApiService.getCalcVariants();
	}

	public updateRawMaterial(params: UpdateRawMaterialsRequest) {
		return this.operationPlanApiService.updateRawMaterial(params);
	}

	public getCities(): Observable<IResponse<IDictionaryItemDto>> {
		return this.operationPlanApiService.getCities();
	}

	public approveMaterials(
		params: ApproveMaterialRequest,
	): Observable<LinkToModule> {
		return this.operationPlanApiService.approveMaterials(params);
	}

	public orderAnOutfit(params: OrderAnOutfitRequest) {
		return this.operationPlanApiService.orderAnOutfit(params);
	}

	public setPlanFact(
		rowId: number,
		params: CreatePlanFactRequest,
	): Observable<OperationPlanItem> {
		return this.operationPlanApiService.setPlanFact(rowId, params);
	}

	public updatePlanFact(
		rowId: number,
		params: UpdatePlanFactRequest,
	): Observable<OperationPlanItem> {
		return this.operationPlanApiService.updatePlanFact(rowId, params);
	}

	public uploadWMS() {
		return this.operationPlanApiService.uploadWMS();
	}
}
