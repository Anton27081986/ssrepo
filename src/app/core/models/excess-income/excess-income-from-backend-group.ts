import { FormControl, FormGroup } from '@angular/forms';

export interface ExcessIncomeFromBackendGroup {
	client: IdName;
	contractor: IdName;
	category: IdName;
	tovSubgroup: IdName;
	currentExcessIncomePercent: number | null;
	nextExcessIncomePercent: number | null;
}

export interface IdName {
	id: number;
	name: string;
	linkToDetail: string;
}

export interface ExcessIncomeGroup {
	client: IdName;
	contractor: IdName;
	category: IdName;
	tovSubgroup: IdName;
	paramsGroup: FormGroup<ExcessIncomeParamsFormGroup>;
	currentExcessIncomePercent: number | null;
	nextExcessIncomePercent: number | null;
}

export interface ExcessIncomeParamsFormGroup {
	sndCurrentControl: FormControl<null | number>;
	sndNextControl: FormControl<null | number>;
}
