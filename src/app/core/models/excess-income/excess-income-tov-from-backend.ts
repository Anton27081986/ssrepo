import { IdName } from '@app/core/models/excess-income/excess-income-from-backend-group';
import { FormControl, FormGroup } from '@angular/forms';

export interface ExcessIncomeTovFromBackend {
	id: number;
	tov: IdName;
	client: IdName;
	contractor: IdName;
	category: IdName;
	tovSubgroup: IdName;
	status: IdName;
	currentParams: ParamTov;
	nextParams: ParamTov;
	comment: string;
}

export interface ExcessIncomeTov {
	id: number;
	tov: IdName;
	client: IdName;
	contractor: IdName;
	category: IdName;
	tovSubgroup: IdName;
	status: IdName;
	paramsGroup: FormGroup<ExcessIncomeParamsFormTov>;
	currentParams: ParamTov;
	nextParams: ParamTov;
	comment: string | null;
}

export interface ExcessIncomeParamsFormTov {
	currentParams: FormGroup<ParamTovControls>;
	nextParams: FormGroup<ParamTovControls>;
}

export interface ParamTovControls {
	price: FormControl<number | null>;
	excessIncomePercent: FormControl<number | null>;
	fixPrice: FormControl<number | null>;
	finalPrice: FormControl<number | null>;
	fixPriceCurrency: FormControl<string | null>;
}

export interface ParamTov {
	price: number | null;
	excessIncomePercent: number | null;
	fixPrice: number | null;
	finalPrice: number | null;
	fixPriceCurrency: string | null;
}
