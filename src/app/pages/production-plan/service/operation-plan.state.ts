import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
	OperationPlanRequest,
	Pagination,
} from '@app/core/models/production-plan/operation-plan';

@Injectable({ providedIn: 'root' })
export class OperationPlanState {
	public weekId$: BehaviorSubject<number | null> = new BehaviorSubject<
		number | null
	>(null);
	public filterValueStore$: BehaviorSubject<
		(OperationPlanRequest & Pagination) | null
	> = new BehaviorSubject<(OperationPlanRequest & Pagination) | null>(null);
}
