import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';
import Editor from 'ckeditor5-custom-build';
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

interface IEditorButton {
	title: string;
	editorElement?: HTMLElement;
}

enum EditorButtons {
	'undo',
	'redo',
	'fontFamily',
	'fontSize',
	'bold',
	'italic',
	'underline',
	'fontColor',
	'fontBackgroundColor',
	'blockQuote',
	'link',
	'alignment',
	'bulletedList',
	'numberedList',
	'removeFormat',
}

@UntilDestroy()
@Component({
	selector: 'ss-mail',
	templateUrl: './mail.component.html',
	styleUrls: ['./mail.component.scss'],
})
export class MailComponent implements OnInit, AfterViewInit {
	protected readonly EditorButtons = EditorButtons;

	@ViewChild('editor') public editor: CKEditorComponent | undefined;
	protected isCustomEditorLoaded = true;

	public Editor = Editor;

	protected fontFamily = 'По умолчанию';
	protected isFontsInitialized = false;

	protected fontSizes = ['10 pt', '12 pt', '14 pt', '18 pt', '24 pt'];
	protected fontSize = '14 pt';
	protected isFontSizesInitialized = false;

	public toUsers: IUserDto[] = [];
	protected toUsersCopy: IUserDto[] = [];

	public subject$: Observable<string | null>;

	public repliedMessage$: Observable<{ message: IMessageItemDto; toUsers: IUserDto[] } | null>;

	public messageFiles$: Observable<IAttachmentDto[] | null>;

	protected myEditorButtons: IEditorButton[] = [
		{ title: 'Отменить' },
		{ title: 'Вернуть' },
		{ title: 'Шрифт' },
		{ title: 'Размер шрифта' },
		{ title: 'Полужирный' },
		{ title: 'Курсив' },
		{ title: 'Подчеркнутый' },
		{ title: 'Цвет текста' },
		{ title: 'Цвет фона' },
		{ title: 'Цитата' },
		{ title: 'Ссылка' },
		{ title: 'Выравнивание' },
		{ title: 'Маркированный список' },
		{ title: 'Нумерованный список' },
		{ title: 'Без оформления' },
	];

	protected mailForm!: FormGroup<{
		subject: FormControl<string | null>;
		text: FormControl<string | null>;
		isPrivate: FormControl<boolean | null>;
	}>;

	private modal: ModalRef | undefined;

	public constructor(
		private readonly changeDetectorRef: ChangeDetectorRef,
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
			isPrivate: new FormControl<boolean>(true),
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
				this.resetForm();
			}
		});

		this.repliedMessage$.pipe(untilDestroyed(this)).subscribe(replyObject => {
			if (replyObject?.toUsers.length) {
				this.toUsers = replyObject.toUsers;
			}
		});
	}

	public ngAfterViewInit(): void {
		this.editor?.ready.pipe(untilDestroyed(this)).subscribe(() => {
			const controls = document.getElementsByClassName('ck-toolbar__items')[0].childNodes;

			if (!controls.length || this.myEditorButtons.length !== controls.length) {
				this.isCustomEditorLoaded = false;
				throw new Error('Ошибка загрузки редактора сообщений');
			}

			controls.forEach((button, index) => {
				if (button.nodeName.toLowerCase() === 'button') {
					this.myEditorButtons[index].editorElement = button as HTMLElement;
				}

				if (button.nodeName.toLowerCase() === 'div') {
					this.myEditorButtons[index].editorElement =
						button.childNodes[0].nodeName.toLowerCase() === 'button'
							? (button.childNodes[0] as HTMLElement)
							: (button.childNodes[0].childNodes[1] as HTMLElement);
					(button.childNodes[0] as HTMLElement).style.visibility = 'hidden';
				}

				this.myEditorButtons[index].editorElement!.style.visibility = 'hidden';
			});
		});
	}

	protected onFontFamilyInit(element: HTMLElement | undefined) {
		if (this.isFontsInitialized) {
			return;
		}

		element?.parentNode?.childNodes[1].childNodes[0].childNodes.forEach(font => {
			font?.childNodes[0].addEventListener('click', event => {
				this.fontFamily = (event.target as HTMLElement).innerText;
				this.changeDetectorRef.detectChanges();
			});
		});

		this.isFontsInitialized = true;
	}

	protected onFontSizeInit(element: HTMLElement | undefined) {
		if (this.isFontSizesInitialized) {
			return;
		}

		element?.parentNode?.childNodes[1].childNodes[0].childNodes.forEach((size, index) => {
			(size?.childNodes[0].childNodes[0] as HTMLElement).innerText = this.fontSizes[index];
			size?.childNodes[0].addEventListener('click', () => {
				this.fontSize = this.fontSizes[index];
				this.changeDetectorRef.detectChanges();
			});
		});

		this.isFontSizesInitialized = true;
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
			subject: '',
			text: '',
			isPrivate: true,
		});
		this.toUsers = [];
		this.toUsersCopy = [];
		this.notificationsFacadeService.selectMessageToReply(null);
	}

	protected closeReply() {
		this.notificationsFacadeService.selectMessageToReply(null);
	}
}
