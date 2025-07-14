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
	PopoverTriggerForDirective,
	DropdownListComponent,
} from '@front-library/components';
import { OperationPlanService } from '@app/pages/production-plan/service/operation-plan.service';
import { IUserProfile } from '@app/core/models/user-profile';
import { ICommentsItemDto } from '@app/core/models/production-plan/comments';
import { UserFacadeService } from '@app/core/facades/user-facade.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { switchMap, tap } from 'rxjs';

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
		PopoverTriggerForDirective,
	],
	templateUrl: './add-comments-modal.component.html',
	styleUrls: ['./add-comments-modal.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCommentsModalComponent implements OnInit, AfterViewInit {
	@Input() data!: number;

	@ViewChild('editable') editableDiv!: ElementRef<HTMLDivElement>;
	@ViewChild('content', { static: true })
	modalContent!: ElementRef<HTMLElement>;

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
		DropdownListComponent,
	);

	ngOnInit() {
		this.userService
			.getUserProfile()
			.pipe(untilDestroyed(this))
			.subscribe((user) => (this.currentUser = user));

		this.service
			.addComment(this.data)
			.pipe(untilDestroyed(this))
			.subscribe((list) => {
				this.comments = list;
				this.cdr.markForCheck();
			});

		this.dropdownList.closed.subscribe(() => {
			this.resetInput();
		});
	}

	ngAfterViewInit() {
		this.autoHeight();
		this.singleLineHeight = this.editableDiv.nativeElement.scrollHeight;
		this.updateMultiLineFlag();
	}

	onInput(): void {
		this.autoHeight();
		this.updateMultiLineFlag();
		this.comment = this.editableDiv.nativeElement.innerText.trim();
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
			.sendComment(this.data, { note: this.comment })
			.pipe(
				switchMap(() => this.service.addComment(this.data)),
				tap((list) => {
					this.comments = list;
					this.cdr.markForCheck();
					this.dropdownList.closed.emit();
				}),
				untilDestroyed(this),
			)
			.subscribe();
	}
}
