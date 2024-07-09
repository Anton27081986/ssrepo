import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import {
	AccessibilityHelp,
	Autosave,
	Bold,
	ClassicEditor,
	type EditorConfig,
	Essentials,
	Italic,
	Paragraph,
	SelectAll,
	Undo,
} from 'ckeditor5';

@Component({
	selector: 'app-sandbox',
	templateUrl: './sandbox.component.html',
	styleUrls: ['./sandbox.component.scss'],
})
export class SandboxComponent implements AfterViewInit {
	public isLayoutReady = false;
	public Editor = ClassicEditor;
	public config: EditorConfig = {}; // CKEditor needs the DOM tree before calculating the configuration.

	constructor(private readonly changeDetector: ChangeDetectorRef) {}

	public ngAfterViewInit(): void {
		this.config = {
			toolbar: {
				items: [
					'undo',
					'redo',
					'|',
					'selectAll',
					'|',
					'bold',
					'italic',
					'|',
					'accessibilityHelp',
				],
				shouldNotGroupWhenFull: true,
			},
			plugins: [
				AccessibilityHelp,
				Autosave,
				Bold,
				Essentials,
				Italic,
				Paragraph,
				SelectAll,
				Undo,
			],
			placeholder: 'Type or paste your content here!',
		};

		this.isLayoutReady = true;
		this.changeDetector.detectChanges();
	}
}
