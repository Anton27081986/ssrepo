import { ChangeDetectionStrategy, Component, effect, input, InputSignal } from '@angular/core';
import { ColumnsStateService } from '@app/core/columns.state.service';
import { rotateAnimation } from '@app/core/animations';
import { GroupNodeState } from '@app/pages/excess-income/excess-income-state/group-node-state';
import { ExcessIncomeClientRowItemField } from '@app/pages/excess-income/excess-income-tr/excess-income-client-tr/excess-income-client-tr.component';
import { numberInputTextMask } from '@app/core/utils/mask';
import { FormControl } from '@angular/forms';
import { ExcessIncomeService } from '@app/pages/excess-income/excess-income-service/excess-income.service';
import { BehaviorSubject, tap } from 'rxjs';
import { ExcessIncomeGroupEventEnum } from '@app/core/models/excess-income/excess-income-root-enum';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ModalService } from '@app/core/modal/modal.service';
import { ExcessIncomeGroup } from '@app/core/models/excess-income/excess-income-group';
import { GroupPriceHistoryComponent } from '@app/pages/excess-income/excess-income-history/group-price-history/group-price-history.component';
import {
	CommentsHistoryComponent
} from "@app/pages/excess-income/excess-income-history/comments-history/comments-history.component";

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
	public group$: BehaviorSubject<ExcessIncomeGroup | null> =
		new BehaviorSubject<ExcessIncomeGroup | null>(null);

	protected sndCurrentControl: FormControl<number | null> = new FormControl<number | null>(null);
	protected sndNextControl: FormControl<number | null> = new FormControl<number | null>(null);

	get canSndCurrentControl(): boolean {
		return this.sndCurrentControl.value !== this.group$.value!.currentExcessIncomePercent;
	}

	get canSndNextControl(): boolean {
		return this.sndNextControl.value !== this.group$.value!.nextExcessIncomePercent;
	}

	constructor(
		protected readonly columnsStateService: ColumnsStateService,
		private readonly excessIncomeService: ExcessIncomeService,
		private readonly modalService: ModalService,
	) {
		effect(() => {
			this.updateForm(this.group().group);
			this.group$.next(this.group().group);
		});
	}

	private updateForm(group: ExcessIncomeGroup) {
		this.sndCurrentControl.setValue(group.currentExcessIncomePercent, {
			emitEvent: false,
		});
		this.sndNextControl.setValue(group.nextExcessIncomePercent, {
			emitEvent: false,
		});
	}

	public updateSnd() {
		this.excessIncomeService
			.updateSndTovGroups(this.group().group.client.id, {
				contractorId: this.group().group.contractor.id,
				tovGroupId: this.group().group.tovSubgroup.id,
				currentExcessIncomePercent: this.sndCurrentControl.value,
				nextExcessIncomePercent: this.sndNextControl.value,
			})
			.pipe(
				tap(group => {
					this.updateForm(group);
					this.group().event$.next(
						ExcessIncomeGroupEventEnum.excessIncomeGroupEventUpdate,
					);
				}),
				untilDestroyed(this),
			)
			.subscribe(this.group$);
	}

	protected openPriceHistory() {
		this.modalService
			.open(GroupPriceHistoryComponent, {
				data: {
					clientId: this.group().group.client.id,
					contractorId: this.group().group.contractor.id,
					tovGroupId: this.group().group.tovSubgroup.id,
				},
			})
			.afterClosed()
			.pipe(untilDestroyed(this))
			.subscribe();
	}

	protected openCommentsHistory() {
		this.modalService
			.open(CommentsHistoryComponent, {
				data: {
					clientId: this.group().group.client.id,
					contractorId: this.group().group.contractor.id,
					tovGroupId: this.group().group.tovSubgroup.id,
				},
			})
			.afterClosed()
			.pipe(untilDestroyed(this))
			.subscribe();
	}

	protected readonly ExcessIncomeClientRowItemField = ExcessIncomeClientRowItemField;
	protected readonly numberInputTextMask = numberInputTextMask;
}
