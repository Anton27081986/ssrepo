import { Component, Inject } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import { DIALOG_DATA } from '@app/core/modal/modal-tokens';
import { ChatBotLikeTypeEnum } from '@app/core/models/chat-bot/like-type-enum';
import {
	AvatarComponent,
	ButtonComponent,
	ButtonType,
	CardComponent,
	FieldCtrlDirective,
	FormFieldComponent,
	IconComponent,
	IconPosition,
	IconType,
	InputComponent,
	LabelComponent,
	LabelType,
	Size,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-components/components';
import { ChatBotFacadeService } from '@app/core/facades/chat-bot-facade.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IChatBotMessage } from '@app/core/models/chat-bot/message';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {CommonModule} from "@angular/common";

interface DialogData {
	likeType: ChatBotLikeTypeEnum;
	message: IChatBotMessage;
}

@UntilDestroy()
@Component({
	selector: 'ss-chat-bot-feedback',
	templateUrl: './feedback.component.html',
	styleUrls: ['./feedback.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		CardComponent,
		AvatarComponent,
		ButtonComponent,
		TextComponent,
		FieldCtrlDirective,
		FormFieldComponent,
		FormsModule,
		InputComponent,
		ReactiveFormsModule,
		IconComponent,
		LabelComponent,
	],
})
export class ChatBotFeedbackComponent {
	protected feedbackForm!: FormGroup<{
		feedback: FormControl<string | null>;
	}>;

	public message: IChatBotMessage | undefined;
	public likeType: ChatBotLikeTypeEnum | undefined;

	constructor(
		private readonly botFacade: ChatBotFacadeService,
		private readonly modalRef: ModalRef,
		@Inject(DIALOG_DATA) private readonly data: DialogData,
	) {
		this.feedbackForm = new FormGroup({
			feedback: new FormControl<string>(''),
		});

		if (!data) {
			return;
		}

		this.message = data.message;
		this.likeType = data.likeType;
	}

	public sendFeedback(): void {
		this.botFacade
			.sendFeedback({
				text: this.feedbackForm.controls.feedback.value,
				messageId: this.message!.id,
				type: this.likeType!,
			})
			.pipe(untilDestroyed(this))
			.subscribe(res => {
				this.message!.likeType = res.likeType;
				this.close();
			});
	}

	public close() {
		this.modalRef.close();
	}

	protected readonly Size = Size;
	protected readonly IconPosition = IconPosition;
	protected readonly IconType = IconType;
	protected readonly TextWeight = TextWeight;
	protected readonly TextType = TextType;
	protected readonly ButtonType = ButtonType;
	protected readonly LabelType = LabelType;
}
