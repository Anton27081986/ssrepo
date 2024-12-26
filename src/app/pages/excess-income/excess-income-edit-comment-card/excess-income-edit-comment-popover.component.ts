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
import { ButtonType, TextType } from '@front-components/components';
import { TovNodeState } from '@app/pages/excess-income/excess-income-state/tov-node-state';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import { ModalRef } from '@app/core/modal/modal.ref';

@UntilDestroy()
@Component({
	selector: 'excess-income-edit-comment-popover',
	templateUrl: './excess-income-edit-comment-popover.component.html',
	styleUrls: ['./excess-income-edit-comment-popover.component.scss'],
	animations: [rotateAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExcessIncomeEditCommentPopoverComponent {
	public tovNode: WritableSignal<TovNodeState> = signal(this.data.tovNode);
	private readonly modalRef = inject(ModalRef);
	protected readonly TextType = TextType;
	protected readonly ButtonType = ButtonType;

	constructor(
		@Inject(DIALOG_DATA)
		protected readonly data: { tovNode: TovNodeState },
	) {}

	update() {
		if (this.tovNode().comment.valid) {
			this.tovNode().updateComment();
			this.close();
		}
	}

	close() {
		this.modalRef.close();
	}
}
