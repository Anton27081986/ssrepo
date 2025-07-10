import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	ElementRef, HostListener,
	inject,
	OnInit,
	ViewChild,
} from '@angular/core';
import {
	AvatarComponent,
	ButtonComponent,
	ButtonType,
	ExtraSize,
	IconType,
	ModalComponent,
	ModalRef,
} from '@front-library/components';
import { OperationPlanService } from '@app/pages/production-plan/service/operation-plan.service';
import { UserFacadeService } from '@app/core/facades/user-facade.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IUserProfile } from '@app/core/models/user-profile';

export interface CreateCommentsModalData {
	id: number;
}

@UntilDestroy()
@Component({
	selector: 'app-create-comments-modal',
	standalone: true,
	imports: [
		ModalComponent,
		ButtonComponent,
		AvatarComponent,
	],
	templateUrl: './create-comments-modal.component.html',
	styleUrl: './create-comments-modal.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCommentsModalComponent implements OnInit, AfterViewInit {
	@ViewChild('editable') editableDiv!: ElementRef<HTMLDivElement>;
	@ViewChild('content', { static: true }) modalContent!: ElementRef<HTMLElement>;

	protected readonly IconType = IconType;
	protected readonly ExtraSize = ExtraSize;
	protected readonly ButtonType = ButtonType;

	public comment: string = '';
	public currentUser: IUserProfile | null = null;
	public isMultiLine = false;
	public singleLineHeight = 0;
	private outsideClickEnabled = false;

	private readonly service: OperationPlanService =
		inject(OperationPlanService);
	private readonly userService: UserFacadeService = inject(UserFacadeService);
	protected readonly popup: ModalRef<CreateCommentsModalData> = inject(
		ModalRef<CreateCommentsModalData>,
	);

	ngOnInit() {
		this.userService
			.getUserProfile()
			.pipe(untilDestroyed(this))
			.subscribe((user) => {
				this.currentUser = user;
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

	public onInput(): void {
		this.autoHeight();
		this.updateMultiLineFlag();
	}

	private updateMultiLineFlag(): void {
		const currentHeight = this.editableDiv.nativeElement.scrollHeight;
		this.isMultiLine = currentHeight > this.singleLineHeight + 1;
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
}
