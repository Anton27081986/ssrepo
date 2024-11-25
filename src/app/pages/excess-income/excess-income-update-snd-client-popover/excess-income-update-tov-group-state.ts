import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { filterTruthy } from '@app/core/facades/client-proposals-facade.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ExcessIncomeUpdateClientTovGroupItem } from '@app/core/models/excess-income/excess-income-update-client-tov-group-item';

@Injectable({
	providedIn: 'root',
})
@UntilDestroy()
export class ExcessIncomeUpdateTovGroupState {
	public tovGroups$: BehaviorSubject<ExcessIncomeUpdateClientTovGroupItem[]> =
		new BehaviorSubject<ExcessIncomeUpdateClientTovGroupItem[]>([]);

	public tovGroupControl: FormControl<IDictionaryItemDto | null> = new FormControl(null);

	constructor() {
		this.tovGroupControl.valueChanges
			.pipe(filterTruthy(), untilDestroyed(this))
			.subscribe(value => {
				this.addTovGroups({
					id: value.id,
					name: value.name!,
					excessIncomePercent: new FormControl<number | null>(null),
				});
				this.tovGroupControl.setValue(null);
			});
	}

	protected addTovGroups(tovGroup: ExcessIncomeUpdateClientTovGroupItem) {
		const aldTovGroups = this.tovGroups$.value;
		if (!aldTovGroups.find(item => item.id === tovGroup.id)) {
			this.tovGroups$.next([...aldTovGroups, tovGroup]);
		}
	}

	public delTovGroups(id: number) {
		const aldTovGroups = this.tovGroups$.value;
		this.tovGroups$.next(aldTovGroups.filter(val => val.id !== id));
	}
}
