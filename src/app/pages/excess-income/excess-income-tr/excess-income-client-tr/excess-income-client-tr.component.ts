import {
	ChangeDetectionStrategy,
	Component,
	input,
	InputSignal,
} from '@angular/core';
import { ColumnsStateService } from '@app/core/columns.state.service';
import { ClientNodeState } from '@app/pages/excess-income/excess-income-state/client-node-state';
import { rotateAnimation } from '@app/core/animations';
import { ModalService } from '@app/core/modal/modal.service';
import { ExcessIncomeUpdateSndClientPopoverComponent } from '@app/pages/excess-income/excess-income-update-snd-client-popover/excess-income-update-snd-client-popover.component';
import { ExcessIncomeState } from '@app/pages/excess-income/excess-income-state/excess-income.state';
import {
	ButtonComponent,
	ButtonType,
	Colors,
	IconPosition,
	IconType,
	LinkComponent,
	Size,
	TextType,
	TooltipDirective,
	TooltipPosition,
	TooltipTheme,
} from '@front-components/components';
import { RouterService, routes } from '@app/core/services/router.service';
import {
	AsyncPipe,
	CommonModule,
	NgForOf,
	NgIf,
	NgSwitch,
	NgSwitchCase,
	NgSwitchDefault,
} from '@angular/common';

export enum ExcessIncomeClientRowItemField {
	client = 'client',
	contractors = 'contractors',
	comments = 'comments',
	nameGroups = 'nameGroups',
	nameTov = 'nameTov',
	current = 'current',
	priceCurrent = 'priceCurrent',
	sndCurrent = 'sndCurrent',
	// priceFixCurrent = 'priceFixCurrent',
	priceCalculateCurrent = 'priceCalculateCurrent',
	next = 'next',
	priceNext = 'currentIntervalNext',
	sndNext = 'sndNext',
	// priceFixNext = 'priceFixNext',
	priceCalculateNext = 'priceCalculateNext',
	actions = 'actions',
}

@Component({
	selector: 'tr[excess-income-client-tr]',
	templateUrl: './excess-income-client-tr.component.html',
	styleUrls: ['./excess-income-client-tr.component.scss'],
	animations: [rotateAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		NgForOf,
		AsyncPipe,
		NgSwitch,
		NgIf,
		NgSwitchCase,
		LinkComponent,
		ButtonComponent,
		TooltipDirective,
		NgSwitchDefault,
	],
	standalone: true,
})
export class ExcessIncomeClientTrComponent {
	public client: InputSignal<ClientNodeState> =
		input.required<ClientNodeState>();

	protected readonly ExcessIncomeClientRowItemField =
		ExcessIncomeClientRowItemField;

	protected readonly IconType = IconType;
	protected readonly IconPosition = IconPosition;
	protected readonly ButtonType = ButtonType;
	protected readonly Size = Size;
	constructor(
		protected readonly columnsStateService: ColumnsStateService,
		private readonly modalService: ModalService,
		private readonly state: ExcessIncomeState,
	) {}

	protected readonly TextType = TextType;
	openUpdateClientPriceModal(isCurrent: boolean) {
		this.modalService.open(ExcessIncomeUpdateSndClientPopoverComponent, {
			data: {
				client: this.client().client,
				isCurrent,
				state: this.state,
			},
		});
	}

	protected readonly Colors = Colors;
	goToClientCard() {
		window.open(
			routes.clientCard.toDetail(this.client().client.id).join('/'),
			'_target',
		);
	}

	protected readonly TooltipTheme = TooltipTheme;
	protected readonly TooltipPosition = TooltipPosition;
}
