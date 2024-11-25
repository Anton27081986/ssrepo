import { ChangeDetectionStrategy, Component, effect, input, InputSignal } from '@angular/core';
import { ColumnsStateService } from '@app/core/columns.state.service';
import { rotateAnimation } from '@app/core/animations';
import { GroupNodeState } from '@app/pages/excess-income/excess-income-state/group-node-state';
import { ExcessIncomeClientRowItemField } from '@app/pages/excess-income/excess-income-tr/excess-income-client-tr/excess-income-client-tr.component';
import { numberInputTextMask } from '@app/core/utils/mask';
import { FormControl, Validators } from '@angular/forms';
import { ExcessIncomeService } from '@app/pages/excess-income/excess-income-service/excess-income.service';
import { switchMap, tap } from 'rxjs';
import { ExcessIncomeGroupEventEnum } from '@app/core/models/excess-income/excess-income-root-enum';
import { filterTruthy } from '@app/core/facades/client-proposals-facade.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
	selector: 'tr[excess-income-group-tr]',
	templateUrl: './excess-income-group-tr.component.html',
	styleUrls: ['./excess-income-group-tr.component.scss'],
	animations: [rotateAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExcessIncomeGroupTrComponent {
	public group: InputSignal<GroupNodeState> = input.required<GroupNodeState>();

	protected sndCurrentControl: FormControl<number | null> = new FormControl<number | null>(
		null,
		Validators.required,
	);
	protected sndNextControl: FormControl<number | null> = new FormControl<number | null>(
		null,
		Validators.required,
	);

	constructor(
		protected readonly columnsStateService: ColumnsStateService,
		private readonly excessIncomeService: ExcessIncomeService,
	) {
		effect(() => {
			this.sndCurrentControl.setValue(this.group().group.currentExcessIncomePercent);
			this.sndNextControl.setValue(this.group().group.nextExcessIncomePercent);
		});

		this.sndCurrentControl.valueChanges
			.pipe(
				filterTruthy(),
				switchMap(value => {
					return this.excessIncomeService.updateSndTovGroups(
						this.group().group.client.id,
						{
							contractorId: this.group().group.contractor.id,
							tovGroupId: this.group().group.tovSubgroup.id,
							currentExcessIncomePercent: value,
							nextExcessIncomePercent: this.group().group.nextExcessIncomePercent,
						},
					);
				}),
				tap(() =>
					this.group().event$.next(
						ExcessIncomeGroupEventEnum.excessIncomeGroupEventUpdate,
					),
				),
				untilDestroyed(this),
			)
			.subscribe();

		this.sndNextControl.valueChanges.pipe(
			filterTruthy(),
			switchMap(value => {
				return this.excessIncomeService.updateSndTovGroups(this.group().group.client.id, {
					contractorId: this.group().group.contractor.id,
					tovGroupId: this.group().group.tovSubgroup.id,
					currentExcessIncomePercent: this.group().group.currentExcessIncomePercent,
					nextExcessIncomePercent: value,
				});
			}),
			tap(() =>
				this.group().event$.next(ExcessIncomeGroupEventEnum.excessIncomeGroupEventUpdate),
			),
			untilDestroyed(this),
		);
	}

	// updateSnd() {
	// 	if (this.sndCurrentControl.valid || this.sndNextControl.valid) {
	// 		this.excessIncomeService
	// 			.updateSndTovGroups(this.group().group.client.id, {
	// 				contractorId: this.group().group.contractor.id,
	// 				tovGroupId: this.group().group.tovSubgroup.id,
	// 				currentExcessIncomePercent: this.sndCurrentControl.value,
	// 				nextExcessIncomePercent: this.sndNextControl.value,
	// 			})
	// 			.pipe(
	// 				tap(() =>
	// 					this.group().event$.next(
	// 						ExcessIncomeGroupEventEnum.excessIncomeGroupEventUpdate,
	// 					),
	// 				),
	// 				untilDestroyed(this),
	// 			)
	// 			.subscribe();
	// 	}
	// }

	protected readonly ExcessIncomeClientRowItemField = ExcessIncomeClientRowItemField;
	protected readonly numberInputTextMask = numberInputTextMask;
}
