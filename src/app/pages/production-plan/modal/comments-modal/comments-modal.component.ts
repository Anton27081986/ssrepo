import {
	AfterViewChecked,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	effect,
	ElementRef,
	inject,
	input,
	InputSignal,
	LOCALE_ID,
	ViewChild,
} from '@angular/core';
import {
	AvatarComponent,
	ButtonComponent,
	ButtonType,
	Colors,
	DividerComponent,
	DropdownListComponent,
	ExtraSize,
	IconPosition,
	IconType, Orientation,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-library/components';
import { OperationPlanService } from '@app/pages/production-plan/service/operation-plan.service';
import { UserFacadeService } from '@app/core/facades/user-facade.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IUserProfile } from '@app/core/models/user-profile';
import { ICommentsItemDto } from '@app/core/models/production-plan/comments';
import { OperationPlanItem } from '@app/core/models/production-plan/operation-plan';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

export interface CreateCommentsModalData {
	id: number;
}

@UntilDestroy()
@Component({
	selector: 'app-comments-modal',
	standalone: true,
	imports: [
		ButtonComponent,
		AvatarComponent,
		ReactiveFormsModule,
		DatePipe,
		TextComponent,
		DividerComponent,
	],
	templateUrl: './comments-modal.component.html',
	styleUrl: './comments-modal.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [{ provide: LOCALE_ID, useValue: 'ru-RU' }],
})
export class CommentsModalComponent implements AfterViewChecked {
	public data: InputSignal<OperationPlanItem> = input.required();

	@ViewChild('editable')
	public editableDiv!: ElementRef<HTMLDivElement>;

	@ViewChild('commentsEl')
	public messagesElement!: ElementRef;

	protected readonly inputControl: FormControl<string | null> =
		new FormControl(null);

	protected readonly IconType = IconType;
	protected readonly ExtraSize = ExtraSize;
	protected readonly ButtonType = ButtonType;

	public comments: ICommentsItemDto[] = [];
	public currentUser: IUserProfile | null = null;

	private readonly service: OperationPlanService =
		inject(OperationPlanService);

	private readonly cdr = inject(ChangeDetectorRef);

	private readonly userService: UserFacadeService = inject(UserFacadeService);

	protected readonly IconPosition = IconPosition;
	protected readonly TextWeight = TextWeight;
	protected readonly Colors = Colors;
	protected readonly TextType = TextType;
	constructor() {
		this.userService
			.getUserProfile()
			.pipe(untilDestroyed(this))
			.subscribe((user) => {
				this.currentUser = user;
			});

		effect(() => {
			this.service
				.comments$(this.data().id)
				.pipe(untilDestroyed(this))
				.subscribe((list) => {
					this.comments = list.map((item) => ({
						...item,
						createdDateObj: new Date(item.createdDate),
					}));
					this.cdr.detectChanges();
					this.scrollToBottom();
				});
		});
	}

	public ngAfterViewChecked(): void {
		this.scrollToBottom();
	}

	protected scrollToBottom(): void {
		if (this.messagesElement) {
			try {
				this.messagesElement.nativeElement.scrollTop =
					this.messagesElement.nativeElement.scrollHeight;
			} catch (err) {
				console.error(err);
			}
		}
	}

	public setValue(event: Event): void {
		const commentInput = event.target as HTMLInputElement;

		this.inputControl.setValue(commentInput.innerText);
	}

	public sendComment(): void {
		const note = this.inputControl.value;

		if (!note) {
			return;
		}

		this.service
			.sendCommentAndRefresh$(this.data().id, { note })
			.pipe(untilDestroyed(this))
			.subscribe((res) => {
				this.inputControl.setValue('');
				this.editableDiv.nativeElement.innerText = '';
				this.data().isComment = res.isComment;
				this.data().commentCount = res.commentCount;
				// this.dropdownList.closed.emit();
			});
	}

	protected readonly Orientation = Orientation;
}
