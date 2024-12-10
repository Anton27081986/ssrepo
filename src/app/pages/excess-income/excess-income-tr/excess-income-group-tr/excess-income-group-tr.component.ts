import { ChangeDetectionStrategy, Component, effect, input, InputSignal } from '@angular/core';
import { ColumnsStateService } from '@app/core/columns.state.service';
import { rotateAnimation } from '@app/core/animations';
import { GroupNodeState } from '@app/pages/excess-income/excess-income-state/group-node-state';
import { ExcessIncomeClientRowItemField } from '@app/pages/excess-income/excess-income-tr/excess-income-client-tr/excess-income-client-tr.component';
import { numberInputTextMask } from '@app/core/utils/mask';
import { FormBuilder, FormControl } from '@angular/forms';
import { ExcessIncomeService } from '@app/pages/excess-income/excess-income-service/excess-income.service';
import { BehaviorSubject, tap } from 'rxjs';
import { ExcessIncomeGroupEventEnum } from '@app/core/models/excess-income/excess-income-root-enum';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ModalService } from '@app/core/modal/modal.service';
import { ExcessIncomeGroup } from '@app/core/models/excess-income/excess-income-group';
import { IconType, Size } from '@front-components/components';
import { CommentsHistoryComponent } from '@app/pages/excess-income/excess-income-history/comments-history/comments-history.component';
import { PriceHistoryComponent } from '@app/pages/excess-income/excess-income-history/price-history/price-history.component';

export interface EditSndGroupForm {
	sndCurrentControl: FormControl<number | null>;
	sndNextControl: FormControl<number | null>;
}

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

	protected formGroup = this._fb.group({
		sndCurrentControl: this._fb.control<number | null>(null),
		sndNextControl: this._fb.control<number | null>(null),
	});

	get getSndCurrentControl() {
		return this.formGroup.controls.sndCurrentControl;
	}

	get getSndNextControl() {
		return this.formGroup.controls.sndNextControl;
	}

	get canSndCurrentControl(): boolean {
		return this.getSndCurrentControl.value !== this.group$.value!.currentExcessIncomePercent;
	}

	get canSndNextControl(): boolean {
		return this.getSndNextControl.value !== this.group$.value!.nextExcessIncomePercent;
	}

	constructor(
		protected readonly columnsStateService: ColumnsStateService,
		private readonly excessIncomeService: ExcessIncomeService,
		private readonly modalService: ModalService,
		private readonly _fb: FormBuilder,
	) {
		effect(() => {
			this.buildForm(this.group().group);
			this.group$.next(this.group().group);

			if (this.group().canEdit) {
				this.getSndNextControl.disable();
				this.getSndCurrentControl.disable();
			}
		});
	}

	private buildForm(group: ExcessIncomeGroup) {
		this.getSndCurrentControl.setValue(group.currentExcessIncomePercent, {
			emitEvent: false,
		});
		this.getSndNextControl.setValue(group.nextExcessIncomePercent, {
			emitEvent: false,
		});
	}

	public updateSnd() {
		this.excessIncomeService
			.updateSndTovGroups(this.group().group.client.id, {
				contractorId: this.group().group.contractor.id,
				tovGroupId: this.group().group.tovSubgroup.id,
				currentExcessIncomePercent: this.getSndCurrentControl.value,
				nextExcessIncomePercent: this.getSndNextControl.value,
			})
			.pipe(
				tap(group => {
					this.buildForm(group);
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
			.open(PriceHistoryComponent, {
				data: {
					title: 'История изменения цены ТПГ',
					objectId: `${this.group().group.client.id}:${this.group().group.contractor.id}:${this.group().group.tovSubgroup.id}`,
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
	protected readonly Size = Size;
	protected readonly IconType = IconType;
}
