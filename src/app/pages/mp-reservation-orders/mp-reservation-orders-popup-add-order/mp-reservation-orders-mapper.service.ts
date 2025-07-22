import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SafeNumberConversion } from '@app/core/utils/safe-number-conversion.util';
import {
	IMpReservationAddOrder,
	IOrderItemsTypes,
} from '@app/core/models/mp-reservation-orders/mp-reservation-add-order';
import { IUserProfile } from '@app/core/models/user-profile';
import {
	AddOrderFormGroup,
	OrderPositionFormGroup,
	OrderDetailFormGroup,
} from './mp-reservation-orders-popup-add-order.types';

/**
 * Сервис для маппинга данных форм в DTO
 */
@Injectable({
	providedIn: 'root',
})
export class MpReservationOrdersMapperService {
	/**
	 * Создает payload для добавления заказа из формы
	 */
	public buildAddOrderPayload$(
		form: AddOrderFormGroup,
		currentUser: IUserProfile | null | undefined
	): Observable<IMpReservationAddOrder> {
		return of(form).pipe(
			map((formValue) =>
				this.mapFormToAddOrderPayload(formValue, currentUser)
			),
			catchError((error) => {
				console.error('Error building add order payload:', error);
				return throwError(
					() => new Error('Failed to build order payload')
				);
			})
		);
	}

	/**
	 * Внутренний маппинг формы в payload
	 */
	private mapFormToAddOrderPayload(
		form: AddOrderFormGroup,
		currentUser: IUserProfile | null | undefined
	): IMpReservationAddOrder {
		const orderItems: IOrderItemsTypes[] =
			form.controls.positions.controls.map(
				(position: OrderPositionFormGroup) =>
					this.mapPositionToOrderItem(position)
			);

		return {
			authorId: SafeNumberConversion.toId(currentUser?.id, {
				fieldName: 'authorId',
				required: true,
			}),
			items: orderItems,
		};
	}

	/**
	 * Маппинг позиции в элемент заказа
	 */
	private mapPositionToOrderItem(
		position: OrderPositionFormGroup
	): IOrderItemsTypes {
		return {
			tovId: SafeNumberConversion.fromFormControl(
				position.controls.tovId,
				{
					fieldName: 'tovId',
					required: true,
				}
			),
			clientId: SafeNumberConversion.fromFormControl(
				position.controls.clientId,
				{
					fieldName: 'clientId',
					required: true,
				}
			),
			orderRequests: position.controls.details.controls.map(
				(detail: OrderDetailFormGroup) => ({
					requestedProvisionDate: detail.controls.date.value ?? '',
					amount: SafeNumberConversion.numberFromForm(
						detail.controls.quantity,
						{
							fieldName: 'quantity',
							defaultValue: 0,
						}
					),
				})
			),
		};
	}
}
