import { inject, Injectable } from '@angular/core';
import { OperationPlanApiService } from '@app/pages/production-plan/service/operation-plan.api-service';
import { map, Observable, tap, switchMap, ReplaySubject, mapTo } from 'rxjs';
import { IDictionaryItemDto } from '@front-library/components';
import { ManufacturingTovs } from '@app/core/models/production-plan/manufacturing-tovs';
import {
	TransferProductionPlanFromBackend,
	TransferProductionPlanMap,
	TransferProductionPlanPatch,
} from '@app/core/models/production-plan/transfer-production-plan-from-backend';
import {
	AbstractControl,
	FormControl,
	ValidatorFn,
	Validators,
} from '@angular/forms';
import { IResponse, ProductionPlanResponse } from '@app/core/utils/response';
import { AddToVRequest } from '@app/core/models/production-plan/add-tov-request';
import {
	OperationPlanItem,
	OperationPlanRequest,
	Pagination,
} from '@app/core/models/production-plan/operation-plan';
import { LinkToModule } from '@app/core/models/production-plan/update-raw-materials-request';
import { ApproveMaterialRequest } from '@app/core/models/production-plan/approve-materials';
import {
	OrderAnOutfit,
	OrderAnOutfitRequest,
} from '@app/core/models/production-plan/order-an-outfit-request';
import {
	OperationPlanEventEnum,
	OperationPlanRootService,
} from '@app/pages/production-plan/service/operation-plan.root.service';
import { UpdateRawMaterialsRequest } from '@app/core/models/production-plan/update-raw-materials-request';
import {
	ICommentsItemDto,
	ISendComment,
} from '@app/core/models/production-plan/comments';
import {
	CreatePlanFactRequest,
	UpdatePlanFactRequest,
} from '@app/core/models/production-plan/plan-fact-request';

@Injectable({ providedIn: 'root' })
export class OperationPlanService {
	private readonly operationPlanApiService: OperationPlanApiService = inject(
		OperationPlanApiService
	);

	private readonly operationPlanRootService: OperationPlanRootService =
		inject(OperationPlanRootService);

	private readonly commentsCache = new Map<
		number,
		ReplaySubject<ICommentsItemDto[]>
	>();

	public getProductionPlan(
		request: OperationPlanRequest & Pagination
	): Observable<ProductionPlanResponse<OperationPlanItem>> {
		return this.operationPlanApiService.getOperationPlan(request);
	}

	public getTransferProductionPlan(
		id: number
	): Observable<IResponse<TransferProductionPlanMap>> {
		return this.operationPlanApiService.getTransferProductionPlan(id).pipe(
			map((res) => {
				return this.mapIResponse(res);
			})
		);
	}

	public comments$(id: number): Observable<ICommentsItemDto[]> {
		if (!this.commentsCache.has(id)) {
			const subject = new ReplaySubject<ICommentsItemDto[]>(1);

			this.commentsCache.set(id, subject);
			this.operationPlanApiService
				.addComment(id)
				.subscribe((list) => subject.next(list));
		}

		return this.commentsCache.get(id)!.asObservable();
	}

	public sendCommentAndRefresh$(
		id: number,
		body: ISendComment
	): Observable<{ isComment: boolean; commentCount: string }> {
		return this.operationPlanApiService.sendComment(id, body).pipe(
			switchMap((res) =>
				this.operationPlanApiService.addComment(id).pipe(
					tap((list) => {
						this.commentsCache.get(id)?.next(list);
					}),
					mapTo({
						isComment: res.isComment,
						commentCount: res.commentCount,
					})
				)
			)
		);
	}

	public sendComment(
		id: number,
		body: ISendComment
	): Observable<{ isComment: boolean; commentCount: string }> {
		return this.operationPlanApiService.sendComment(id, body);
	}

	public addComment(id: number): Observable<ICommentsItemDto[]> {
		return this.operationPlanApiService.addComment(id);
	}

	public transferProductionPlan(
		params: TransferProductionPlanMap[]
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

		return this.operationPlanApiService
			.transferProductionPlan(mapParams)
			.pipe(
				tap(() => {
					this.operationPlanRootService.event$.next({
						type: OperationPlanEventEnum.operationPlanAdd,
					});
				})
			);
	}

	public upload1C(weekId: number): Observable<LinkToModule> {
		return this.operationPlanApiService.upload1C(weekId);
	}

	public downloadReport(): Observable<LinkToModule> {
		return this.operationPlanApiService.downloadReport();
	}

	public downloadExel(
		request: OperationPlanRequest & Pagination
	): Observable<Blob> {
		return this.operationPlanApiService.downloadExel(request);
	}

	public getWeeks(): Observable<IDictionaryItemDto[]> {
		return this.operationPlanApiService.getWeeks().pipe(
			map((res) => {
				return res.items;
			})
		);
	}

	public getManufacturingTov(
		query: string,
		limit: number,
		offset: number
	): Observable<IResponse<ManufacturingTovs>> {
		return this.operationPlanApiService.getManufacturingTov(
			query,
			limit,
			offset
		);
	}

	private mapIResponse(
		input: IResponse<TransferProductionPlanFromBackend>
	): IResponse<TransferProductionPlanMap> {
		const mappedItems = input.items.map((item) => ({
			id: item.id,
			orderId: item.orderId,
			customerUser: item.customerUser,
			quantity: item.quantity,
			countForPostpone: new FormControl<number | null>(0),
			productionDateControl: new FormControl<Date | null>(
				new Date(item.productionDate),
				{
					nonNullable: true,
					validators: [
						Validators.required,
						this.minOriginalDateValidator(
							new Date(item.productionDate)
						),
					],
				}
			),
			originalProductionDate: new Date(item.productionDate),
		}));

		return {
			items: mappedItems,
			total: input.total,
			totalQuantity: input.totalQuantity,
			linkToModule: input.linkToModule,
		};
	}

	private minOriginalDateValidator(origDate: Date): ValidatorFn {
		return (control: AbstractControl<Date | null>) => {
			const controlValue = control.value;

			if (!controlValue) {
				return null;
			}

			return controlValue < origDate
				? { dateTooEarly: { requiredDate: origDate } }
				: null;
		};
	}

	public addGp(params: AddToVRequest): Observable<void> {
		return this.operationPlanApiService.addGp(params).pipe(
			tap(() => {
				this.operationPlanRootService.event$.next({
					type: OperationPlanEventEnum.operationPlanAdd,
				});
			})
		);
	}

	public deleteItemsTov(tovIds: number[]): Observable<void> {
		return this.operationPlanApiService.deleteItemsTov(tovIds).pipe(
			tap(() => {
				this.operationPlanRootService.event$.next({
					type: OperationPlanEventEnum.operationPlanDelete,
				});
			})
		);
	}

	public getCalcVariants(): Observable<IResponse<IDictionaryItemDto>> {
		return this.operationPlanApiService.getCalcVariants();
	}

	public updateRawMaterial(
		params: UpdateRawMaterialsRequest
	): Observable<LinkToModule> {
		return this.operationPlanApiService.updateRawMaterial(params);
	}

	public getCities(): Observable<IResponse<IDictionaryItemDto>> {
		return this.operationPlanApiService.getCities();
	}

	public approveMaterials(
		params: ApproveMaterialRequest
	): Observable<LinkToModule> {
		return this.operationPlanApiService.approveMaterials(params);
	}

	public orderAnOutfit(
		params: OrderAnOutfitRequest
	): Observable<OrderAnOutfit> {
		return this.operationPlanApiService.orderAnOutfit(params);
	}

	public setPlanFact(
		rowId: number,
		params: CreatePlanFactRequest
	): Observable<OperationPlanItem> {
		return this.operationPlanApiService.setPlanFact(rowId, params);
	}

	public updatePlanFact(
		rowId: number,
		params: UpdatePlanFactRequest
	): Observable<OperationPlanItem> {
		return this.operationPlanApiService.updatePlanFact(rowId, params);
	}

	public uploadWMS(date: string): Observable<LinkToModule> {
		return this.operationPlanApiService.uploadWMS(date);
	}

	public getPlanInfo(
		weekId: number,
		date: string,
		productionSectionIds: number[]
	): Observable<{ planDayTotalQuantity: number }> {
		return this.operationPlanApiService.getPlanInfo(
			weekId,
			date,
			productionSectionIds
		);
	}
}
