import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	inject,
	Input,
	OnInit,
	ViewChild,
} from '@angular/core';
import {
	AvatarComponent,
	ButtonComponent,
	ButtonType,
	DropdownListComponent,
	ExtraSize,
	IconType,
} from '@front-library/components';
import { OperationPlanService } from '@app/pages/production-plan/service/operation-plan.service';
import { UserFacadeService } from '@app/core/facades/user-facade.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IUserProfile } from '@app/core/models/user-profile';
import { ICommentsItemDto } from '@app/core/models/production-plan/comments';
import { OperationPlanItem } from '@app/core/models/production-plan/operation-plan';

export interface CreateCommentsModalData {
	id: number;
}

@UntilDestroy()
@Component({
	selector: 'app-create-comments-modal',
	standalone: true,
	imports: [ButtonComponent, AvatarComponent],
	templateUrl: './create-comments-modal.component.html',
	styleUrl: './create-comments-modal.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCommentsModalComponent implements OnInit, AfterViewInit {
	@Input()
	data!: OperationPlanItem;

	@ViewChild('editable')
	editableDiv!: ElementRef<HTMLDivElement>;

	@ViewChild('content', { static: true })
	modalContent!: ElementRef<HTMLElement>;

	protected readonly IconType = IconType;
	protected readonly ExtraSize = ExtraSize;
	protected readonly ButtonType = ButtonType;

	public comments: ICommentsItemDto[] = [];
	public comment = '';
	public currentUser: IUserProfile | null = null;
	public isMultiLine = false;
	public singleLineHeight = 0;

	private readonly service: OperationPlanService =
		inject(OperationPlanService);

	private readonly userService: UserFacadeService = inject(UserFacadeService);
	private readonly dropdownList: DropdownListComponent = inject(
		DropdownListComponent,
	);

	private readonly cdr = inject(ChangeDetectorRef);

	ngOnInit() {
		this.userService
			.getUserProfile()
			.pipe(untilDestroyed(this))
			.subscribe((user) => {
				this.currentUser = user;
			});

		this.dropdownList.closed.subscribe(() => {
			this.resetInput();
		});
	}

	ngAfterViewInit() {
		this.autoHeight();
		const style = getComputedStyle(this.editableDiv.nativeElement);

		this.singleLineHeight = parseFloat(style.lineHeight);
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

	public sendComment(): void {
		const text = this.editableDiv.nativeElement.innerText.trim();

		if (!text) return;

		this.comment = text;
		this.service
			.sendCommentAndRefresh$(this.data.id, { note: this.comment })
			.pipe(untilDestroyed(this))
			.subscribe(res => {
				this.data.isComment    = res.isComment;
				this.data.commentCount = res.commentCount;
				this.dropdownList.closed.emit();
			});
	}
}
