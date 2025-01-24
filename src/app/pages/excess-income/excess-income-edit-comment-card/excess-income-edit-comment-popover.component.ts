import { UntilDestroy } from '@ngneat/until-destroy';
import {
	ChangeDetectionStrategy,
	Component,
	inject,
	Inject,
	signal,
	WritableSignal,
} from '@angular/core';
import { rotateAnimation } from '@app/core/animations';
import {ButtonComponent, ButtonType, DividerComponent, TextComponent, TextType} from '@front-components/components';
import { TovNodeState } from '@app/pages/excess-income/excess-income-state/tov-node-state';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import { ModalRef } from '@app/core/modal/modal.ref';
import { FormControl, Validators } from '@angular/forms';
import { F } from '@angular/cdk/keycodes';
import {CardComponent} from "@app/shared/components/card/card.component";
import {
	FormControlInputWithFuncEditComponent
} from "@app/shared/components/inputs/form-control-input-with-func-edit/form-control-input-with-func-edit.component";

@UntilDestroy()
@Component({
	selector: 'excess-income-edit-comment-popover',
	templateUrl: './excess-income-edit-comment-popover.component.html',
	styleUrls: ['./excess-income-edit-comment-popover.component.scss'],
	animations: [rotateAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CardComponent,
		TextComponent,
		DividerComponent,
		FormControlInputWithFuncEditComponent,
		ButtonComponent
	],
	standalone: true
})
export class ExcessIncomeEditCommentPopoverComponent {
	public tovNode: WritableSignal<TovNodeState> = signal(this.data.tovNode);
	private readonly modalRef = inject(ModalRef);
	protected readonly TextType = TextType;
	protected readonly ButtonType = ButtonType;

	comment: FormControl<string | null>;

	constructor(
		@Inject(DIALOG_DATA)
		protected readonly data: { tovNode: TovNodeState },
	) {
		this.comment = new FormControl(this.tovNode().tovCommentSignal(), [
			Validators.maxLength(50),
		]);
	}

	update() {
		if (this.comment.valid) {
			this.tovNode().updateComment(this.comment.value);
			this.close();
		}
	}

	close() {
		this.modalRef.close();
	}
}
