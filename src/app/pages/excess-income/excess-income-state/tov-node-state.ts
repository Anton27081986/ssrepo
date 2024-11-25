import { ExcessIncomeTov } from '@app/core/models/excess-income/excess-income-tov';
import { ExcessIncomeService } from '@app/pages/excess-income/excess-income-service/excess-income.service';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ExcessIncomeState } from '@app/pages/excess-income/excess-income-state/excess-income.state';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { ExcessIncomeBaseNodeState } from '@app/pages/excess-income/excess-income-state/excess-income-base-node.state';

@UntilDestroy()
export class TovNodeState extends ExcessIncomeBaseNodeState {
	public tov: ExcessIncomeTov;
	public state: ExcessIncomeState;
	public currency: IDictionaryItemDto;
	constructor(
		tov: ExcessIncomeTov,
		service: ExcessIncomeService,
		state: ExcessIncomeState,
		currency: IDictionaryItemDto,
	) {
		super();
		this.tov = tov;
		this.state = state;
		this.currency = currency;
	}
}
