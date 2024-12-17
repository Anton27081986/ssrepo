import { ChangeDetectionStrategy, Component, Inject, Signal } from '@angular/core';
import { ExcessIncomeClient } from '@app/core/models/excess-income/excess-income-client';
import { rotateAnimation } from '@app/core/animations';
import { ModalRef } from '@app/core/modal/modal.ref';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { map, NEVER, Observable, switchMap, tap } from 'rxjs';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { SearchFacadeService } from '@app/core/facades/search-facade.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ColumnsStateService } from '@app/core/columns.state.service';
import { ITrTableBaseColumn } from '@app/core/store';
import { ExcessIncomeUpdateTovGroupState } from '@app/pages/excess-income/excess-income-update-snd-client-popover/excess-income-update-tov-group-state';
import { numberInputTextMask } from '@app/core/utils/mask';
import { ExcessIncomeService } from '@app/pages/excess-income/excess-income-service/excess-income.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ExcessIncomeEventEnum } from '@app/core/models/excess-income/excess-income-root-enum';
import { ExcessIncomeState } from '@app/pages/excess-income/excess-income-state/excess-income.state';
import { NotificationToastService } from '@app/core/services/notification-toast.service';
import { ButtonType, IconType, Size } from '@front-components/components';

export interface ExcessIncomeUpdateSndClientPopoverData {
	client: ExcessIncomeClient;
	isCurrent: boolean;
	state: ExcessIncomeState;
}

export enum ExcessIncomeSndClientRowItemField {
	tovGroup = 'tovGroup',
	snd = 'snd',
}
@UntilDestroy()
@Component({
	selector: 'app-excess-income-update-snd-client-popover',
	templateUrl: './excess-income-update-snd-client-popover.component.html',
	styleUrls: ['./excess-income-update-snd-client-popover.component.scss'],
	providers: [ColumnsStateService],
	animations: [rotateAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExcessIncomeUpdateSndClientPopoverComponent {
	protected client: ExcessIncomeClient;

	protected readonly options: Signal<IDictionaryItemDto[]>;

	protected queryControl: FormControl<string | null> = new FormControl('');

	protected tovGroupControl = this.state.tovGroupControl;

	protected tovGroups$ = this.state.tovGroups$;

	get getIsDisabledButton(): boolean {
		return this.tovGroups$.value.length === 0;
	}

	constructor(
		private readonly modalRef: ModalRef,
		private readonly stateColumn: ColumnsStateService,
		private readonly searchService: SearchFacadeService,
		private readonly state: ExcessIncomeUpdateTovGroupState,
		private readonly excessIncomeService: ExcessIncomeService,
		private readonly toastService: NotificationToastService,
		@Inject(DIALOG_DATA) protected readonly data: ExcessIncomeUpdateSndClientPopoverData,
	) {
		this.client = this.data.client;
		this.stateColumn.colsTr$.next(this.defaultCols);
		this.options = toSignal(
			this.queryControl.valueChanges.pipe(
				switchMap(val => {
					if (val) {
						return this.searchService.getTovGroupsByClient(val, this.client.id);
					}

					return NEVER;
				}),
				map(res => res.items),
			),
			{ initialValue: [] },
		);
	}

	protected close() {
		this.modalRef.close();
		this.state.tovGroups$.next([]);
	}

	submit() {
		const isValid = this.tovGroups$.value.find(item => item.excessIncomePercent.valid);

		if (isValid) {
			this.excessIncomeService
				.updateSndClient(this.client.id, {
					isCurrent: this.data.isCurrent,
					items: this.tovGroups$.value.map(item => {
						return {
							tovGroupId: item.id,
							excessIncomePercent: Number(item.excessIncomePercent.value) ?? 0,
						};
					}),
				})
				.pipe(
					tap(() =>
						this.data.state.event$.next(
							ExcessIncomeEventEnum.excessIncomeClientUpdated,
						),
					),
					untilDestroyed(this),
				)
				.subscribe(() => {
					this.close();
				});
		} else {
			this.toastService.addToast('Поле СНД,% заполнено неверно', 'error');
		}
	}

	protected defaultCols: ITrTableBaseColumn[] = [
		{
			cols: [
				{
					id: ExcessIncomeSndClientRowItemField.tovGroup,
					title: 'Товарная подгруппа',
					order: 1,
					show: true,
					width: null,
					display: true,
					rowspan: 1,
					colspan: 1,
				},
				{
					id: ExcessIncomeSndClientRowItemField.snd,
					title: 'СНД,%',
					order: 2,
					show: true,
					width: null,
					display: true,
					rowspan: 1,
					colspan: 1,
				},
			],
		},
	];

	protected readonly numberInputTextMask = numberInputTextMask;
	protected readonly ButtonType = ButtonType;
	protected readonly Size = Size;
	protected readonly IconType = IconType;
}
