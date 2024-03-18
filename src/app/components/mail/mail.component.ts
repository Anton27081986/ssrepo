import { Component, ViewChild, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';
import Editor from 'ckeditor5/build/ckeditor';
import { Subject, takeUntil } from 'rxjs';
import { FileBucketsEnum, FilesApiService } from '@app/core/api/files.api.service';
import { IFile } from '../../core/models/files/file';

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

@Component({
	selector: 'ss-mail',
	templateUrl: './mail.component.html',
	styleUrls: ['./mail.component.scss'],
})
export class MailComponent implements AfterViewInit, OnDestroy {
	private readonly destroy$ = new Subject<void>();

	protected readonly EditorButtons = EditorButtons;

	@ViewChild('editor') editor: CKEditorComponent | undefined;
	protected isCustomEditorLoaded = true;

	public Editor = Editor;

	protected fontFamily = 'По умолчанию';
	protected isFontsInitialized = false;

	protected fontSizes = ['10 pt', '12 pt', '14 pt', '18 pt', '24 pt'];
	protected fontSize = '14 pt';
	protected isFontSizesInitialized = false;

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

	protected files: IFile[] = [];

	constructor(
		private readonly changeDetectorRef: ChangeDetectorRef,
		private readonly filesApiService: FilesApiService,
	) {}

	public ngAfterViewInit(): void {
		this.editor?.ready.pipe(takeUntil(this.destroy$)).subscribe(val => {
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

		const file = Array.from(fileList)[0];

		const reader = new FileReader();

		reader.onload = () => {
			this.filesApiService
				.uploadFile(FileBucketsEnum.Attachments, file)
				.pipe(takeUntil(this.destroy$))
				.subscribe(res => {
					this.files.push(res);
					this.changeDetectorRef.detectChanges();
				});
		};

		reader.readAsDataURL(file);
	}

	public deleteFile(id: string) {
		this.filesApiService
			.deleteFile(id)
			.pipe(takeUntil(this.destroy$))
			.subscribe(() => {
				this.files = this.files.filter(file => file.id !== id);
				this.changeDetectorRef.detectChanges();
			});
	}

	public ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
