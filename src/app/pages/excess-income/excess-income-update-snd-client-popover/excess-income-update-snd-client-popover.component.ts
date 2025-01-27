import { ChangeDetectionStrategy, Component, Inject, Signal } from '@angular/core';
import { ExcessIncomeClient } from '@app/core/models/excess-income/excess-income-client';
import { rotateAnimation } from '@app/core/animations';
import { ModalRef } from '@app/core/modal/modal.ref';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import { FormControl, ReactiveFormsModule} from '@angular/forms';
import { map, NEVER, switchMap, tap } from 'rxjs';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { SearchFacadeService } from '@app/core/facades/search-facade.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ColumnsStateService } from '@app/core/columns.state.service';
import { ITrTableBaseColumn } from '@app/core/store';
import { ExcessIncomeUpdateTovGroupState } from '@app/pages/excess-income/excess-income-update-snd-client-popover/excess-income-update-tov-group-state';
import { ExcessIncomeService } from '@app/pages/excess-income/excess-income-service/excess-income.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ExcessIncomeEventEnum } from '@app/core/models/excess-income/excess-income-root-enum';
import { ExcessIncomeState } from '@app/pages/excess-income/excess-income-state/excess-income.state';
import {
	ButtonComponent,
	ButtonType, IconComponent,
	IconPosition,
	IconType, LabelComponent,
	LabelType,
	Size, TextComponent,
	TextType,
} from '@front-components/components';
import { ModalService } from '@app/core/modal/modal.service';
import { NoticeDialogComponent } from '@app/shared/components/notice-dialog/notice-dialog.component';
import { NotificationType } from '@front-components/components/lib/models/enums';
import { NotificationToastService } from '@app/core/services/notification-toast.service';
import {CardComponent} from "@app/shared/components/card/card.component";
import {SsDividerComponent} from "@app/shared/components/ss-divider/ss-divider.component";
import {SearchInputV2Component} from "@app/shared/components/inputs/search-input-v2/search-input-v2.component";
import {TableV2Component} from "@app/shared/components/ss-table-v2/ss-table-v2.component";
import {AsyncPipe, CommonModule, NgForOf, NgIf} from "@angular/common";
import {EmptyPlaceholderComponent} from "@app/shared/components/empty-placeholder/empty-placeholder.component";
import {
	ExcessIncomeUpdateTovGroupTrComponent
} from "@app/pages/excess-income/excess-income-update-snd-client-popover/excess-income-update-tov-group-tr/excess-income-update-tov-group-tr.component";

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
	animations: [rotateAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		CardComponent,
		TextComponent,
		IconComponent,
		SsDividerComponent,
		SearchInputV2Component,
		ReactiveFormsModule,
		TableV2Component,
		NgIf,
		NgForOf,
		EmptyPlaceholderComponent,
		ExcessIncomeUpdateTovGroupTrComponent,
		LabelComponent,
		ButtonComponent,
		AsyncPipe
	],
	standalone: true
})
export class ExcessIncomeUpdateSndClientPopoverComponent {
	protected client: ExcessIncomeClient;

	protected readonly options: Signal<IDictionaryItemDto[]>;

	protected queryControl: FormControl<string | null> = new FormControl('');

	protected tovGroupControl = this.state.tovGroupControl;

	protected tovGroups$ = this.state.tovGroups$;

	constructor(
		private readonly modalRef: ModalRef,
		private readonly stateColumn: ColumnsStateService,
		private readonly searchService: SearchFacadeService,
		protected readonly state: ExcessIncomeUpdateTovGroupState,
		private readonly excessIncomeService: ExcessIncomeService,
		private readonly modalService: ModalService,
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
		if (this.tovGroups$.value.length) {
			this.modalService
				.open(NoticeDialogComponent, {
					data: {
						header: 'Вы уверены, что хотите удалить запись?',
						text: 'После удаления ее невозможно будет вернуть',
						type: 'Error',
						buttonOk: 'Удалить',
						buttonCancel: 'Отмена',
					},
				})
				.afterClosed()
				.pipe(untilDestroyed(this))
				.subscribe(status => {
					if (status) {
						this.modalRef.close();
						this.state.tovGroups$.next([]);
					}
				});
			return;
		}

		this.modalRef.close();
		this.state.tovGroups$.next([]);
	}

	submit() {
		const isNotValid = this.tovGroups$.value.find(item => !item.excessIncomePercent.valid);
		if (isNotValid) {
			this.modalService
				.open(NoticeDialogComponent, {
					data: {
						header: 'Вы уверены, что хотите применить изменения?',
						text: 'Поля у некоторых товарных подгрупп отсутствуют и будут обнулены',
						type: 'Warning',
						buttonOk: 'Применить',
						buttonCancel: 'Нет',
					},
				})
				.afterClosed()
				.subscribe(status => {
					if (status) {
						this.updateSnd();
					} else {
						return;
					}
				});
		} else {
			this.updateSnd();
		}
	}

	public updateSnd() {
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
					this.data.state.event$.next(ExcessIncomeEventEnum.excessIncomeClientUpdated),
				),
				untilDestroyed(this),
			)
			.subscribe(() => {
				this.modalRef.close();
				this.state.tovGroups$.next([]);
				this.toastService.addToast('СНД,% успешно установлены', 'ok');
			});
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
					width: '140px',
					display: true,
					rowspan: 1,
					colspan: 1,
				},
			],
		},
	];
	protected readonly ButtonType = ButtonType;
	protected readonly Size = Size;
	protected readonly IconType = IconType;
	protected readonly TextType = TextType;
	protected readonly IconPosition = IconPosition;
	protected readonly LabelType = LabelType;
}
