import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, OperatorFunction } from 'rxjs';
import { FormControl } from '@angular/forms';

@Injectable({
	providedIn: 'root',
})
export class ExcessIncomeBaseNodeState {
	public expended$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	public isLoader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	public total$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	public readonly paginationControl: FormControl<number | null> = new FormControl<number>(0);
	public limit = 20;

	// filterTruthy() {
	// 	return filter(src => !!src) as OperatorFunction<TValue | null | undefined, TValue>;
	// }
}
