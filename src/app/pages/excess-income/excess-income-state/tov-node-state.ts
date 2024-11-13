import { ExcessIncomeTov } from '@app/core/models/excess-income/excess-income-tov';
import { ExcessIncomeService } from '@app/pages/excess-income/excess-income-service/excess-income.service';
import { UntilDestroy } from '@ngneat/until-destroy';
@UntilDestroy()
export class TovNodeState {
	public tov: ExcessIncomeTov;
	public limit = 20;
	constructor(tov: ExcessIncomeTov, service: ExcessIncomeService) {
		this.tov = tov;
	}
}
