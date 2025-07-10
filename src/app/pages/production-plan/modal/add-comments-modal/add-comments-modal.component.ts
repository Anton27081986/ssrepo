import {
	Component,
	OnInit,
	AfterViewInit,
	ElementRef,
	ViewChild,
	ChangeDetectionStrategy,
	inject,
	ChangeDetectorRef,
	HostListener,
	Input,
} from '@angular/core';
import {
	AvatarComponent,
	ButtonType,
	ButtonComponent,
	IconType,
	ModalRef,
	TextComponent,
	TextType,
	TextWeight,
	Colors,
	PopoverTriggerForDirective,
} from '@front-library/components';
import { OperationPlanService } from '@app/pages/production-plan/service/operation-plan.service';
import { IUserProfile } from '@app/core/models/user-profile';
import { ICommentsItemDto } from '@app/core/models/production-plan/comments';
import { UserFacadeService } from '@app/core/facades/user-facade.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DatePipe, NgFor, NgIf } from '@angular/common';

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
	private outsideClickEnabled = false;

	private readonly popup = inject(ModalRef<AddCommentsModalData>);
	private readonly service = inject(OperationPlanService);
	private readonly userService = inject(UserFacadeService);
	private readonly cdr = inject(ChangeDetectorRef);

	ngOnInit() {
		this.userService
			.getUserProfile()
			.pipe(untilDestroyed(this))
			.subscribe((u) => (this.currentUser = u));

		this.service
			.addComment(this.popup.data.id)
			.pipe(untilDestroyed(this))
			.subscribe((list) => {
				this.comments = list;
				this.cdr.markForCheck();
			});
	}

	ngAfterViewInit() {
		this.autoHeight();
		this.singleLineHeight = this.editableDiv.nativeElement.scrollHeight;
		this.updateMultiLineFlag();

		setTimeout(() => {
			this.outsideClickEnabled = true;
		}, 0);
	}

	@HostListener('document:click', ['$event'])
	onDocumentClick(event: MouseEvent) {
		if (!this.outsideClickEnabled) {
			return;
		}
		if (
			this.modalContent &&
			!this.modalContent.nativeElement.contains(event.target as Node)
		) {
			this.popup.close();
		}
	}

	onInput(): void {
		this.autoHeight();
		this.updateMultiLineFlag();
		this.comment = this.editableDiv.nativeElement.innerText.trim();
	}

	private updateMultiLineFlag(): void {
		const h = this.editableDiv.nativeElement.scrollHeight;
		this.isMultiLine = h > this.singleLineHeight + 1;
	}

	private autoHeight(): void {
		const el = this.editableDiv.nativeElement;

		el.style.height = 'auto';
		el.style.height = `${el.scrollHeight}px`;
	}

	public sendComment(): void {
		const text = this.editableDiv.nativeElement.innerText.trim();

		if (!text) return;

		this.comment = text;
		this.service.sendComment(this.popup.data.id, {
			note: this.comment,
		});
		this.popup.close();
	}

	// public close() {
	// 	this.popoverHost.close();     // закрыть поповер
	// }
}
