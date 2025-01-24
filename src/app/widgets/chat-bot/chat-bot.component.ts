import { Component, ElementRef, Signal, ViewChild } from '@angular/core';
import { ModalRef } from '@app/core/modal/modal.ref';
import {
	AvatarComponent,
	ButtonComponent,
	ButtonType,
	CardComponent,
	Colors,
	ExtendedSize,
	FieldCtrlDirective,
	FormFieldComponent,
	IconComponent,
	IconPosition,
	IconType,
	InputComponent,
	Size,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-components/components';
import { ChatBotFacadeService, ChatBotStates } from '@app/core/facades/chat-bot-facade.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import {DatePipe, NgClass, NgOptimizedImage} from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IChatBotMessage } from '@app/core/models/chat-bot/message';
import { ChatBotMessageTypeEnum } from '@app/core/models/chat-bot/message-type-enum';
import { ModalService } from '@app/core/modal/modal.service';
import { ChatBotFeedbackComponent } from '@app/widgets/chat-bot/feedback/feedback.component';
import { ChatBotLikeTypeEnum } from '@app/core/models/chat-bot/like-type-enum';
import {LoaderComponent} from "@app/shared/components/loader/loader.component";

@Component({
	selector: 'app-chat-bot',
	templateUrl: './chat-bot.component.html',
	styleUrls: ['./chat-bot.component.scss'],
	standalone: true,
	imports: [
		CardComponent,
		IconComponent,
		TextComponent,
		ButtonComponent,
		AvatarComponent,
		NgClass,
		ReactiveFormsModule,
		FormFieldComponent,
		FieldCtrlDirective,
		InputComponent,
		DatePipe,
		NgOptimizedImage,
		LoaderComponent,
	],
})
export class ChatBotComponent {
	protected questionForm!: FormGroup<{
		question: FormControl<string | null>;
	}>;

	public messages: Signal<IChatBotMessage[]> = toSignal(this.botFacade.messages$, {
		initialValue: [],
	});

	public subsectors: Signal<IDictionaryItemDto[]> = toSignal(this.botFacade.subsectors$, {
		initialValue: [],
	});

	public activeSubsector: Signal<IDictionaryItemDto | null> = toSignal(
		this.botFacade.activeSubsector$,
		{
			initialValue: null,
		},
	);

	public state: Signal<ChatBotStates> = toSignal(this.botFacade.state$, {
		initialValue: ChatBotStates.Ready,
	});

	@ViewChild('messagesEl') public messagesElement!: ElementRef;

	public pageIndex = 1;
	public pageSize = 10;
	public offset = 10;

	constructor(
		private readonly modalRef: ModalRef,
		private readonly modalService: ModalService,
		private readonly botFacade: ChatBotFacadeService,
	) {
		this.questionForm = new FormGroup({
			question: new FormControl<string>('', [Validators.required]),
		});

		this.botFacade.getMessages(this.pageSize, 0);
	}

	protected loadMoreMessages() {
		if (
			this.messagesElement.nativeElement.scrollHeight -
				this.messagesElement.nativeElement.offsetHeight +
				this.messagesElement.nativeElement.scrollTop <
			200
		) {
			this.pageIndex += 1;

			this.offset = this.pageSize * this.pageIndex - this.pageSize;
			this.botFacade.getMessages(this.pageSize, this.offset);
		}
	}

	public selectSubsector(subsector: IDictionaryItemDto) {
		this.botFacade.setActiveSubsector(subsector);
	}

	public sendMessage(): void {
		this.botFacade.sendMessage(this.questionForm.controls.question.value);
	}

	public openFeedBack(message: IChatBotMessage, likeType: ChatBotLikeTypeEnum): void {
		this.modalService.open(ChatBotFeedbackComponent, { data: { message, likeType } });
	}

	public close() {
		this.modalRef.close();
		this.botFacade.clearStorage();
	}

	protected readonly IconType = IconType;
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly ButtonType = ButtonType;
	protected readonly IconPosition = IconPosition;
	protected readonly ExtendedSize = ExtendedSize;
	protected readonly ChatBotMessageTypeEnum = ChatBotMessageTypeEnum;
	protected readonly Colors = Colors;
	protected readonly Size = Size;
	protected readonly ChatBotStates = ChatBotStates;
	protected readonly ChatBotLikeTypeEnum = ChatBotLikeTypeEnum;
}
