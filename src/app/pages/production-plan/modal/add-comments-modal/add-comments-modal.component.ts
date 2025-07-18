import {
	Component,
	OnInit,
	AfterViewInit,
	ElementRef,
	ViewChild,
	ChangeDetectionStrategy,
	inject,
	ChangeDetectorRef,
	Input,
	LOCALE_ID,
} from '@angular/core';
import {
	AvatarComponent,
	ButtonType,
	ButtonComponent,
	IconType,
	TextComponent,
	TextType,
	TextWeight,
	Colors,
	DropdownListComponent,
} from '@front-library/components';
import { OperationPlanService } from '@app/pages/production-plan/service/operation-plan.service';
import { IUserProfile } from '@app/core/models/user-profile';
import { ICommentsItemDto } from '@app/core/models/production-plan/comments';
import { UserFacadeService } from '@app/core/facades/user-facade.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { switchMap, tap } from 'rxjs';
import { OperationPlanItem } from '@app/core/models/production-plan/operation-plan';

export interface AddCommentsModalData {
	id: number;
}

@UntilDestroy()
@Component({
	selector: 'app-add-comments-modal',
	standalone: true,
	imports: [
		NgFor,
		NgIf,
		TextComponent,
		ButtonComponent,
		AvatarComponent,
		DatePipe,
	],
	templateUrl: './add-comments-modal.component.html',
	styleUrls: ['./add-comments-modal.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [{ provide: LOCALE_ID, useValue: 'ru' }],
})
export class AddCommentsModalComponent implements OnInit, AfterViewInit {
	@Input()
	public data!: OperationPlanItem;

	@ViewChild('editable')
	public editableDiv!: ElementRef<HTMLDivElement>;

	@ViewChild('content', { static: true })
	public modalContent!: ElementRef<HTMLElement>;

	@ViewChild('commentsEl')
	public messagesElement!: ElementRef;

	protected readonly ButtonType = ButtonType;
	protected readonly IconType = IconType;
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly Colors = Colors;

	public comments: ICommentsItemDto[] = [];
	public comment = '';
	public isMultiLine = false;
	public currentUser: IUserProfile | null = null;
	private singleLineHeight = 0;

	private readonly service = inject(OperationPlanService);
	private readonly userService = inject(UserFacadeService);
	private readonly cdr = inject(ChangeDetectorRef);
	private readonly dropdownList: DropdownListComponent = inject(
		DropdownListComponent
	);

	public ngOnInit(): void {
		this.userService
			.getUserProfile()
			.pipe(untilDestroyed(this))
			// eslint-disable-next-line no-return-assign
			.subscribe((user) => (this.currentUser = user));

		this.loadCommentsList(this.data.id);

		this.dropdownList.closed.subscribe(() => {
			this.resetInput();
		});

		this.service
			.comments$(this.data.id)
			.pipe(untilDestroyed(this))
			.subscribe((list) => {
				this.comments = list.map((item) => ({
					...item,
					createdDateObj: new Date(item.createdDate),
				}));
				this.cdr.detectChanges();
			});
	}

	public ngAfterViewInit(): void {
		this.autoHeight();
		this.singleLineHeight = this.editableDiv.nativeElement.scrollHeight;
		this.updateMultiLineFlag();
	}

	public onInput(): void {
		const element = this.editableDiv.nativeElement;
		const text = element.innerText.trim();

		if (!text) {
			element.innerHTML = '';
		}

		this.comment = text;
		this.autoHeight();
		this.updateMultiLineFlag();
	}

	private updateMultiLineFlag(): void {
		const currentHeight = this.editableDiv.nativeElement.scrollHeight;

		this.isMultiLine = currentHeight > this.singleLineHeight + 1;
	}

	private autoHeight(): void {
		const element = this.editableDiv.nativeElement;

		element.style.height = 'auto';
		element.style.height = `${element.scrollHeight}px`;
	}

	private resetInput(): void {
		this.comment = '';
		this.editableDiv.nativeElement.innerText = '';
		this.autoHeight();
		this.isMultiLine = false;
		this.cdr.markForCheck();
	}

	public loadCommentsList(rowId: number): void {
		this.service
			.addComment(rowId)
			.pipe(untilDestroyed(this))
			.subscribe((list) => {
				this.comments = list.map((item) => ({
					...item,
					createdDateObj: new Date(item.createdDate),
				}));
				this.cdr.detectChanges();
				setTimeout(() => {
					this.scrollToBottom();
				}, 1);
			});
	}

	public sendComment(): void {
		const text = this.editableDiv.nativeElement.innerText.trim();

		if (!text) {
			return;
		}

		this.comment = text;

		this.service
			.sendComment(this.data.id, { note: this.comment })
			.pipe(
				tap((res) => {
					this.data.isComment = res.isComment;
					this.data.commentCount = res.commentCount;
				}),
				switchMap(() => this.service.addComment(this.data.id)),
				tap((list) => {
					this.comments = list.map((item) => ({
						...item,
						createdDateObj: new Date(item.createdDate),
					}));
					this.cdr.markForCheck();
					this.dropdownList.closed.emit();
				}),
				untilDestroyed(this)
			)
			.subscribe();
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
}
