import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';

/**
 * Типы для деталей заказа
 */
export interface OrderDetailFormControls {
	quantity: FormControl<number | null>;
	date: FormControl<string | null>;
}

export type OrderDetailFormGroup = FormGroup<OrderDetailFormControls>;

/**
 * Типы для позиции заказа
 */
export interface OrderPositionFormControls {
	headerTitle: FormControl<string>;
	headerTovName: FormControl<string>;
	tovId: FormControl<number | null>;
	clientId: FormControl<number | null>;
	details: FormArray<OrderDetailFormGroup>;
}

export type OrderPositionFormGroup = FormGroup<OrderPositionFormControls>;

/**
 * Типы для основной формы добавления заказа
 */
export interface AddOrderFormControls {
	tov: FormControl<IDictionaryItemDto | null>;
	client: FormControl<IDictionaryItemDto | null>;
	positions: FormArray<OrderPositionFormGroup>;
}

export type AddOrderFormGroup = FormGroup<AddOrderFormControls>;
