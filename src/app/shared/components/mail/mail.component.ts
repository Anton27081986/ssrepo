import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	Input,
	OnInit,
	ViewChild,
} from '@angular/core';
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';
import Editor from 'ckeditor5/build/ckeditor';
import { Observable, Subject, takeUntil } from 'rxjs';
import { FilesApiService } from '@app/core/api/files.api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationsApiService } from '@app/core/api/notifications-api.service';
import { NotificationsFacadeService } from '@app/core/facades/notifications-facade.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IUserDto } from '@app/core/models/notifications/user-dto';
import { IMessageItemDto } from '@app/core/models/notifications/message-item-dto';
import { IAttachmentDto } from '@app/core/models/notifications/attachment-dto';

interface EditorButtonI {
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
	@Input() public objectId!: number;

	private readonly destroy$ = new Subject<void>();

	protected readonly EditorButtons = EditorButtons;

	@ViewChild('editor') public editor: CKEditorComponent | undefined;
	protected isCustomEditorLoaded = true;

	public Editor = Editor;

	protected fontFamily = 'По умолчанию';
	protected isFontsInitialized = false;

	protected fontSizes = ['10 pt', '12 pt', '14 pt', '18 pt', '24 pt'];
	protected fontSize = '14 pt';
	protected isFontSizesInitialized = false;

	@Input() public toUsers: IUserDto[] = [];
	protected toUsersCopy: IUserDto[] = [];

	@Input() public selectedMessageToReply: IMessageItemDto | undefined;

	public subject$: Observable<string | null>;

	protected myEditorButtons: EditorButtonI[] = [
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

	protected files: IAttachmentDto[] = [];

	protected mailForm!: FormGroup<{
		subject: FormControl<string | null>;
		text: FormControl<string | null>;
		isPrivate: FormControl<boolean | null>;
	}>;

	public constructor(
		private readonly changeDetectorRef: ChangeDetectorRef,
		private readonly filesApiService: FilesApiService,
		private readonly notificationsApiService: NotificationsApiService,
		private readonly notificationsFacadeService: NotificationsFacadeService,
	) {
		this.subject$ = this.notificationsFacadeService.selectedSubject$;
	}

	public ngOnInit() {
		this.mailForm = new FormGroup({
			subject: new FormControl<string>('', Validators.required),
			text: new FormControl<string>('', Validators.required),
			isPrivate: new FormControl<boolean>(true),
		});

		this.subject$.pipe(takeUntil(this.destroy$)).subscribe(subject => {
			this.mailForm.controls.subject.setValue(subject);
		});
	}

	public ngAfterViewInit(): void {
		this.editor?.ready.pipe(takeUntil(this.destroy$)).subscribe(() => {
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
				this.notificationsFacadeService
					.uploadFile(file)
					.pipe(untilDestroyed(this))
					.subscribe(res => {
						this.files.push(res);
						this.changeDetectorRef.detectChanges();
					});
			};

			reader.readAsDataURL(file);
		});
	}

	protected deleteFile(id: string) {
		this.notificationsFacadeService
			.deleteFile(id)
			.pipe(untilDestroyed(this))
			.subscribe(() => {
				this.files = this.files.filter(file => file.id !== id);
				this.changeDetectorRef.detectChanges();
			});
	}

	protected sendMessage() {
		if (this.mailForm.controls.subject.errors) {
			this.mailForm.markAllAsTouched();

			return;
		}

		this.notificationsApiService
			.sendMessage({
				objectId: this.objectId,
				type: 0,
				subject: this.mailForm.controls.subject.value,
				text: this.mailForm.controls.text.value,
				toUserIds: this.toUsers.map(user => user.id!),
				copyUserIds: this.toUsersCopy.map(user => user.id!),
				isPrivate: this.mailForm.controls.isPrivate.value!,
				replyToMessageId: this.selectedMessageToReply?.id,
				fileIds: this.files.map(file => file.id!),
			})
			.pipe(untilDestroyed(this))
			.subscribe(() => {
				this.notificationsFacadeService
					.loadSubjects(this.objectId)
					.pipe(takeUntil(this.destroy$))
					.subscribe();
				this.notificationsFacadeService
					.loadMessages(this.objectId, this.mailForm.controls.subject.value!)
					.pipe(takeUntil(this.destroy$))
					.subscribe();
				this.mailForm.reset();
				this.toUsers = [];
				this.toUsersCopy = [];
				this.files = [];
			});

		this.notificationsFacadeService
			.loadFiles(this.objectId, this.mailForm.controls.subject.value!)
			.subscribe();
	}

	protected closeReply() {
		this.selectedMessageToReply = undefined;
	}
}
