import { FormControl } from '@angular/forms';

export interface ExcessIncomeUpdateClientTovGroupItem {
	id: number;
	name: string;
	excessIncomePercent: FormControl<number | null>;
}
