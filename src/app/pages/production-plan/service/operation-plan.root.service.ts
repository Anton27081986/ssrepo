import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export enum OperationPlanEventEnum {
	operationPlanAdd = 'operationPlanAdd',
	operationPlanDelete = 'operationPlanDelete',
}

interface OperationPlanEvent {
	type: OperationPlanEventEnum;
}

@Injectable({ providedIn: 'root' })
export class OperationPlanRootService {
	public readonly event$: Subject<OperationPlanEvent> =
		new Subject<OperationPlanEvent>();
}
