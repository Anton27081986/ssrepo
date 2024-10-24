import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateFromLessDateTo(dateFrom: string, dateTo: string): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const dateFromCtrl = control.get(dateFrom);
		const dateToCtrl = control.get(dateTo);

		if (
			!dateFromCtrl ||
			!dateToCtrl ||
			dateFromCtrl.pristine ||
			dateToCtrl.pristine ||
			new Date(dateFromCtrl.value) < new Date(dateToCtrl.value)
		) {
			return null;
		}

		return { dateFromLessDateTo: true };
	};
}
