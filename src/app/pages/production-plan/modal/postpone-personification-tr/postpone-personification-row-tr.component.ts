import {
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
	InputSignal,
	OnInit,
} from '@angular/core';
import {
	ButtonComponent,
	ColumnsStateService,
	DatepickerComponent,
	FieldCtrlDirective,
	FormFieldComponent,
	InputComponent,
	TextComponent,
	TextType,
	TextWeight,
	InputType,
} from '@front-library/components';
import { TransferProductionPlanMap } from '@app/core/models/operation-plan/transfer-production-plan-from-backend';
import {
	AsyncPipe,
	DatePipe,
	NgForOf,
	NgIf,
	NgSwitch,
	NgSwitchCase,
} from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

export enum PostponePersonificationRowItemField {
	orderNumber = 'orderNumber',
	customer = 'customer',
	count = 'count',
	countForPostpone = 'countForPostpone',
	postponeForData = 'postponeForData',
}

@Component({
	selector: 'tr[postpone-personification-row-tr]',
	standalone: true,
	imports: [
		ButtonComponent,
		AsyncPipe,
		NgForOf,
		NgSwitch,
		NgSwitchCase,
		TextComponent,
		InputComponent,
		FormFieldComponent,
		DatePipe,
		FieldCtrlDirective,
		ReactiveFormsModule,
		DatepickerComponent,
		NgIf,
	],
	templateUrl: './postpone-personification-row-tr.component.html',
	styleUrl: './postpone-personification-row-tr.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostponePersonificationRowTrComponent {
	public personification: InputSignal<TransferProductionPlanMap> =
		input.required<TransferProductionPlanMap>();

	protected hoverCount = false;

	protected hoverDateControl = false;

	protected focusCount = false;

	protected viewCountControl = false;

	protected focusDateControl = false;

	protected viewDateControl = false;

	protected now: Date = new Date();

	protected readonly columnState = inject(ColumnsStateService);

	protected readonly PostponePersonificationRowItemField =
		PostponePersonificationRowItemField;
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly InputType = InputType;

	protected mouseleaveCount() {
		this.hoverCount = false;
		if (!this.focusCount) {
			this.viewCountControl = false;
		}
	}

	protected mouseEnterCount() {
		this.hoverCount = true;
		this.viewCountControl = true;
	}

	protected focusOutCount() {
		this.focusCount = false;
		this.viewCountControl = false;
	}

	protected mouseleaveDateControl() {
		this.hoverDateControl = false;
		if (!this.focusDateControl) {
			this.viewDateControl = false;
		}
	}

	protected mouseEnterDateControl() {
		this.hoverDateControl = true;
		this.viewDateControl = true;
	}

	protected focusOutDateControl() {
		this.focusDateControl = false;
		setTimeout(() => {
			this.viewDateControl = false;
		}, 0);
	}
}
