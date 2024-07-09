import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CorrespondenceFacadeService } from '@app/core/facades/correspondence-facade.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IUserDto } from '@app/core/models/notifications/user-dto';
import { IMessageItemDto } from '@app/core/models/notifications/message-item-dto';
import { IAttachmentDto } from '@app/core/models/notifications/attachment-dto';
import { ModalService } from '@app/core/modal/modal.service';
import { DialogComponent } from '@app/shared/components/dialog/dialog.component';
import { ModalRef } from '@app/core/modal/modal.ref';
import {
	ClassicEditor,
	AccessibilityHelp,
	Alignment,
	AutoLink,
	Autosave,
	BlockQuote,
	Bold,
	Essentials,
	FontBackgroundColor,
	FontColor,
	FontFamily,
	FontSize,
	Indent,
	IndentBlock,
	Italic,
	Link,
	List,
	Paragraph,
	RemoveFormat,
	SelectAll,
	Strikethrough,
	Underline,
	Undo,
	type EditorConfig
} from 'ckeditor5';

@UntilDestroy()
@Component({
	selector: 'ss-mail',
	templateUrl: './mail.component.html',
	styleUrls: ['./mail.component.scss'],
})
export class MailComponent implements OnInit, AfterViewInit {
	public isLayoutReady = false;
	public Editor = ClassicEditor;
	public config: EditorConfig = {};

	public toUsers: IUserDto[] = [];
	protected toUsersCopy: IUserDto[] = [];

	public subject$: Observable<string | null>;

	public repliedMessage$: Observable<{ message: IMessageItemDto; toUsers: IUserDto[] } | null>;

	public messageFiles$: Observable<IAttachmentDto[] | null>;

	protected mailForm!: FormGroup<{
		subject: FormControl<string | null>;
		text: FormControl<string | null>;
		isPrivate: FormControl<boolean | null>;
	}>;

	private modal: ModalRef | undefined;

	public constructor(
		private readonly changeDetector: ChangeDetectorRef,
		private readonly notificationsFacadeService: CorrespondenceFacadeService,
		private readonly modalService: ModalService,
	) {
		this.subject$ = this.notificationsFacadeService.selectedSubject$;
		this.repliedMessage$ = this.notificationsFacadeService.repliedMessage$;
		this.messageFiles$ = this.notificationsFacadeService.messageFiles$;
	}

	public ngOnInit() {
		this.mailForm = new FormGroup({
			subject: new FormControl<string>('', Validators.required),
			text: new FormControl<string>('', Validators.required),
			isPrivate: new FormControl<boolean>(false),
		});

		this.subject$.pipe(untilDestroyed(this)).subscribe(subject => {
			if (this.mailForm.controls.text.value && !this.modal) {
				this.modal = this.modalService.open(DialogComponent, {
					data: {
						header: 'Изменения не будут сохранены',
						text: 'Введенное сообщение не будет сохранено.\n Продолжить?',
					},
				});

				this.modal
					.afterClosed()
					.pipe(untilDestroyed(this))
					.subscribe(res => {
						if (res) {
							this.resetForm();
							this.mailForm.controls.subject.setValue(subject);
						} else {
							this.notificationsFacadeService.selectSubject(
								this.mailForm.controls.subject.value,
							);
						}

						this.modal = undefined;
					});
			} else {
				this.mailForm.controls.subject.setValue(subject);
			}
		});

		this.repliedMessage$.pipe(untilDestroyed(this)).subscribe(replyObject => {
			if (replyObject?.message) {
				this.mailForm.controls.subject.setValue(replyObject.message.subject!);
			}

			if (replyObject?.toUsers.length) {
				this.toUsers = replyObject.toUsers;
			}
		});
	}

	public ngAfterViewInit(): void {
		this.config = {
			toolbar: {
				items: [
					'undo',
					'redo',
					'|',
					'fontSize',
					'fontFamily',
					'fontColor',
					'fontBackgroundColor',
					'|',
					'bold',
					'italic',
					'underline',
					'strikethrough',
					'removeFormat',
					'|',
					'link',
					'blockQuote',
					'|',
					'alignment',
					'|',
					'bulletedList',
					'numberedList',
					'indent',
					'outdent'
				],
				shouldNotGroupWhenFull: true
			},
			plugins: [
				AccessibilityHelp,
				Alignment,
				AutoLink,
				Autosave,
				BlockQuote,
				Bold,
				Essentials,
				FontBackgroundColor,
				FontColor,
				FontFamily,
				FontSize,
				Indent,
				IndentBlock,
				Italic,
				Link,
				List,
				Paragraph,
				RemoveFormat,
				SelectAll,
				Strikethrough,
				Underline,
				Undo
			],
			fontFamily: {
				supportAllValues: true
			},
			fontSize: {
				options: [12, 14, 'default', 18, 20],
				supportAllValues: true
			},
			link: {
				addTargetToExternalLinks: true,
				defaultProtocol: 'https://',
				decorators: {
					toggleDownloadable: {
						mode: 'manual',
						label: 'Downloadable',
						attributes: {
							download: 'file'
						}
					}
				}
			},
			placeholder: 'Введите текст сообщения'
		};

		this.isLayoutReady = true;
		this.changeDetector.detectChanges();
	}

	protected uploadFile(event: Event) {
		const element = event.currentTarget as HTMLInputElement;
		const fileList: FileList | null = element.files;

		if (!fileList) {
			return;
		}

		Array.from(fileList).forEach(file => {
			const reader = new FileReader();

			reader.onload = () => {
				this.notificationsFacadeService.uploadFile(file);
			};

			reader.readAsDataURL(file);
		});
	}

	protected deleteFile(id: string) {
		this.notificationsFacadeService.deleteFile(id);
	}

	public onSendMessage() {
		if (!this.mailForm.controls.subject.value || !this.mailForm.controls.text.value) {
			this.mailForm.markAllAsTouched();

			return;
		}

		if (!this.toUsers.length) {
			const dialog = this.modalService.open(DialogComponent, {
				data: {
					header: 'Вы не указали адресатов',
					text:
						'Ваше сообщение будет сохранено, \n' +
						'но уведомления не будут отправлены на e-mail. \n' +
						'Продолжить?',
				},
			});

			dialog
				.afterClosed()
				.pipe(untilDestroyed(this))
				.subscribe(res => {
					if (res) {
						this.sendMessage();
					}
				});
		} else {
			this.sendMessage();
		}
	}

	private sendMessage() {
		this.notificationsFacadeService.sendMessage(
			this.mailForm.controls.subject.value!,
			this.mailForm.controls.text.value!,
			this.toUsers.map(user => user.id!),
			this.toUsersCopy.map(user => user.id!),
			this.mailForm.controls.isPrivate.value!,
		);

		this.resetForm();
	}

	private resetForm() {
		this.mailForm.reset({
			subject: this.mailForm.controls.subject.value,
			text: '',
			isPrivate: false,
		});
		this.toUsers = [];
		this.toUsersCopy = [];
		this.notificationsFacadeService.selectMessageToReply(null);
	}

	protected closeReply() {
		this.notificationsFacadeService.selectMessageToReply(null);
	}
}
