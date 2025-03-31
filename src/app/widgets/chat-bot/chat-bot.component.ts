import {
	ChangeDetectorRef,
	Component,
	ElementRef,
	Signal,
	ViewChild,
} from '@angular/core';
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
	TextareaComponent,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-components/components';
import {
	ChatBotFacadeService,
	ChatBotStates,
} from '@app/core/facades/chat-bot-facade.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { DatePipe, NgClass, NgOptimizedImage } from '@angular/common';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { IChatBotMessage } from '@app/core/models/chat-bot/message';
import { ChatBotMessageTypeEnum } from '@app/core/models/chat-bot/message-type-enum';
import { ModalService } from '@app/core/modal/modal.service';
import { ChatBotFeedbackComponent } from '@app/widgets/chat-bot/feedback/feedback.component';
import { ChatBotLikeTypeEnum } from '@app/core/models/chat-bot/like-type-enum';
import { MdToHtmlPipe } from '@app/core/pipes/md-to-html.pipe';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
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
		TextareaComponent,
		MdToHtmlPipe,
	],
})
export class ChatBotComponent {
	protected questionForm!: FormGroup<{
		question: FormControl<string | null>;
	}>;

	public isOpened: Signal<boolean> = toSignal(this.botFacade.isOpened$, {
		initialValue: false,
	});

	public messages: Signal<IChatBotMessage[]> = toSignal(
		this.botFacade.messages$,
		{
			initialValue: [],
		},
	);

	public subsectors: Signal<IDictionaryItemDto[]> = toSignal(
		this.botFacade.subsectors$,
		{
			initialValue: [],
		},
	);

	public activeSubsector: Signal<IDictionaryItemDto | null> = toSignal(
		this.botFacade.activeSubsector$,
		{
			initialValue: null,
		},
	);

	public state: Signal<ChatBotStates> = toSignal(this.botFacade.state$, {
		initialValue: ChatBotStates.Ready,
	});

	@ViewChild('messagesEl')
	public messagesElement!: ElementRef;

	public pageIndex = 1;
	public pageSize = 10;
	public offset = 10;

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
	constructor(
		private readonly modalService: ModalService,
		private readonly botFacade: ChatBotFacadeService,
		private readonly changeDetectorRef: ChangeDetectorRef,
	) {
		this.questionForm = new FormGroup({
			question: new FormControl<string>('', [Validators.required]),
		});

		this.botFacade.getSubsectors();
		this.botFacade.getMessages(this.pageSize, 0);

		this.botFacade.state$.pipe(untilDestroyed(this)).subscribe((state) => {
			if (this.messagesElement) {
				setTimeout(() => {
					this.messagesElement.nativeElement.scrollTop =
						this.messagesElement.nativeElement.scrollHeight;
				}, 1);
			}

			if (state === 'Generating') {
				this.questionForm.controls.question.setValue(null);
			}
		});

		this.botFacade.isOpened$
			.pipe(untilDestroyed(this))
			.subscribe((status) => {
				if (status && this.messagesElement) {
					this.messagesElement.nativeElement.scrollTop =
						this.messagesElement.nativeElement.scrollHeight;
				}
			});
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

	public sendMessage(event?: KeyboardEvent): void {
		if (event && event.key !== 'Enter') {
			return;
		}

		event?.preventDefault();
		this.botFacade.sendMessage(this.questionForm.controls.question.value);
	}

	public openFeedBack(
		message: IChatBotMessage,
		likeType: ChatBotLikeTypeEnum,
	): void {
		this.modalService
			.open(ChatBotFeedbackComponent, { data: { message, likeType } })
			.afterClosed()
			.pipe(untilDestroyed(this))
			.subscribe(() => {
				this.changeDetectorRef.detectChanges();
			});
	}

	public close() {
		this.botFacade.toggleBot();
		this.questionForm.controls.question.setValue(null);
	}
}
