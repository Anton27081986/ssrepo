import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, OperatorFunction } from 'rxjs';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
	providedIn: 'root',
})
export class ExcessIncomeBaseNodeState {
	public expended$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	public isLoader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	public total$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	public readonly paginationControl: FormControl<number | null> = new FormControl<number>(0);
	public limit = 20;
}

export function compareValues(oldValue: number | null): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const newValue = control.value;

		return newValue !== oldValue ? null : { valuesDoNotMatch: true };
	};
}
