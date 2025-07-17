import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MpReservationFilter } from '@app/core/models/mp-reservation-orders/mp-reservation-orders-filter';
import { IResponse } from '@app/core/utils/response';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import {
	IMpReservationOrder,
	IProvisionDetailsTypes,
} from '@app/core/models/mp-reservation-orders/mp-reservation-order';
import { IMpReservationAddOrder } from '@app/core/models/mp-reservation-orders/mp-reservation-add-order';
import { IChangeTrackerItemDto } from '@app/core/models/change-tracker/change-tracker-item-dto';
import { IClarifyOrder } from '@app/pages/mp-reservation-order-card/mp-reservation-orders-card-popup-qualification/mp-reservation-orders-card-popup-qualification.models';
import { IApproveClarificationResponse } from '@app/pages/mp-reservation-order-card/mp-reservation-orders-card-popup-change-approve-details-change/mp-reservation-orders-card-popup-change-approve-details-change.models';
import {
	IQueueOrderDto,
	IQueueReorderPosition,
} from '@app/core/models/mp-reservation-orders/mp-reservation-queue-order';
import { IWarehouseBalanceResponse } from '@app/core/models/mp-reservation-orders/mp-reservation-warehouse-stock';
import { IDispatchesRequest } from '@app/core/models/mp-reservation-orders/mp-reservation-transfer-dispatch';

@Injectable({
	providedIn: 'root',
})
export class MpReservationOrdersApiService {
	public constructor(private readonly http: HttpClient) {}

	public getOrders(
		filter: MpReservationFilter,
	): Observable<{
		data: IResponse<IMpReservationOrder>;
		permissions: string[];
	}> {
		let params = new HttpParams();

		if (filter.id !== null && filter.id !== undefined) {
			params = params.set('id', filter.id);
		}

		if (filter.authorId !== null && filter.authorId !== undefined) {
			params = params.set('authorId', filter.authorId);
		}

		if (filter.tovId !== null && filter.tovId !== undefined) {
			params = params.set('tovId', filter.tovId);
		}

		if (filter.managerId !== null && filter.managerId !== undefined) {
			params = params.set('managerId', filter.managerId);
		}

		if (filter.statusId !== null && filter.statusId !== undefined) {
			params = params.set('statusId', filter.statusId);
		}

		if (
			filter.dateCreatedFrom !== null &&
			filter.dateCreatedFrom !== undefined
		) {
			params = params.set('dateCreatedFrom', filter.dateCreatedFrom);
		}

		if (
			filter.dateCreatedTo !== null &&
			filter.dateCreatedTo !== undefined
		) {
			params = params.set('dateCreatedTo', filter.dateCreatedTo);
		}

		if (filter.clientId !== null && filter.clientId !== undefined) {
			params = params.set('clientId', filter.clientId);
		}

		if (filter.limit !== null && filter.limit !== undefined) {
			params = params.set('limit', filter.limit);
		}

		if (filter.offset !== null && filter.offset !== undefined) {
			params = params.set('offset', filter.offset);
		}

		return this.http.get<{
			data: IResponse<IMpReservationOrder>;
			permissions: string[];
		}>(
			`${environment.apiUrl}/api/manufacturing/Personification/Personification`,
			{ params },
		);
	}

	public getPersonificationById(
		id: string,
	): Observable<{ data: IMpReservationOrder }> {
		return this.http.get<{ data: IMpReservationOrder }>(
			`${environment.apiUrl}/api/manufacturing/personification/personification/${id}`,
		);
	}

	public createOrderPersonification(
		body: IMpReservationAddOrder,
	): Observable<IMpReservationOrder[]> {
		return this.http.post<IMpReservationOrder[]>(
			`${environment.apiUrl}/api/manufacturing/Personification/Personification`,
			body,
		);
	}

	public updateProvisionDate(
		orderId: number,
		provisionDate: string,
	): Observable<void> {
		return this.http.patch<void>(
			`${environment.apiUrl}/api/manufacturing/Personification/Personification/${orderId}/provisionDate`,
			{ provisionDate },
		);
	}

	public updateProvisionDateById(
		orderId: number,
		provisionDate: string,
		provisionId: number,
	): Observable<void> {
		return this.http.patch<void>(
			`${environment.apiUrl}/api/manufacturing/Personification/Personification/${orderId}/provisionDate/${provisionId}`,
			{ provisionDate },
		);
	}

	public rejectPersonification(
		orderId: number,
		reason: string,
	): Observable<void> {
		return this.http.patch<void>(
			`${environment.apiUrl}/api/manufacturing/Personification/Personification/${orderId}/reject`,
			{ reason },
		);
	}

	public removePersonification(orderId: number): Observable<void> {
		return this.http.patch<void>(
			`${environment.apiUrl}/api/manufacturing/Personification/Personification/${orderId}/remove`,
			{},
		);
	}

	public rejectRemovePersonification(orderId: number): Observable<void> {
		return this.http.patch<void>(
			`${environment.apiUrl}/api/manufacturing/Personification/Personification/${orderId}/remove/cancel`,
			{},
		);
	}

	public createDetails(
		orderId: number,
		body: IProvisionDetailsTypes[],
	): Observable<void> {
		return this.http.post<void>(
			`${environment.apiUrl}/api/manufacturing/Personification/Personification/${orderId}/provision/details`,
			body,
		);
	}

	public getHistoryOrder(
		objectId: string,
		limit: number,
		offset: number,
	): Observable<IResponse<IChangeTrackerItemDto>> {
		let params = new HttpParams()
			.set('ObjectId', objectId)
			.set('Type', '5')
			.set('limit', limit)
			.set('offset', offset);

		return this.http.get<IResponse<IChangeTrackerItemDto>>(
			`${environment.apiUrl}/api/change-tracker/history`,
			{ params },
		);
	}

	public changeDetails(
		orderId: number,
		body: IProvisionDetailsTypes,
	): Observable<void> {
		return this.http.patch<void>(
			`${environment.apiUrl}/api/manufacturing/Personification/Personification/${orderId}/provision/details`,
			body,
		);
	}

	public changeManager(orderId: number, authorId: number): Observable<void> {
		return this.http.patch<void>(
			`${environment.apiUrl}/api/manufacturing/Personification/Personification/${orderId}/author`,
			{ authorId },
		);
	}

	public clarify(orderId: number, body: IClarifyOrder): Observable<void> {
		return this.http.post<void>(
			`${environment.apiUrl}/api/manufacturing/Personification/Personification/${orderId}/alternatives`,
			body,
		);
	}

	public getApproveClarification(
		orderId: number,
	): Observable<IApproveClarificationResponse> {
		return this.http.get<IApproveClarificationResponse>(
			`${environment.apiUrl}/api/manufacturing/Personification/Personification/${orderId}/alternatives`,
		);
	}

	public getQueueOrders(): Observable<{
		data: IQueueOrderDto[];
		permissions: string[];
	}> {
		return this.http.get<{ data: IQueueOrderDto[]; permissions: string[] }>(
			`${environment.apiUrl}/api/manufacturing/Queue`,
		);
	}

	public getWarehouseForAgreeOrder(
		orderId: number,
	): Observable<IWarehouseBalanceResponse> {
		return this.http.get<IWarehouseBalanceResponse>(
			`${environment.apiUrl}/api/manufacturing/Personification/Personification/${orderId}/stockbalance`,
		);
	}

	public createTransferInvoice(
		orderId: number,
		body: IDispatchesRequest,
	): Observable<void> {
		return this.http.post<void>(
			`${environment.apiUrl}/api/manufacturing/Personification/Personification/${orderId}/stockbalance`,
			body,
		);
	}

	public reorderQueueOrders(
		body: IQueueReorderPosition,
	): Observable<{ data: IResponse<IQueueOrderDto>; permissions: string[] }> {
		return this.http.put<{
			data: IResponse<IQueueOrderDto>;
			permissions: string[];
		}>(`${environment.apiUrl}/api/manufacturing/Queue/Reorder`, body);
	}

	public approveClarification(orderId: number): Observable<void> {
		return this.http.patch<void>(
			`${environment.apiUrl}/api/manufacturing/Personification/Personification/${orderId}/alternatives`,
			{},
		);
	}
}
