import { Component, Input, OnInit } from '@angular/core';
import { AppIcons } from '@app/core/icons';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
	selector: 'ss-icon',
	templateUrl: './icon.component.html',
	styleUrls: ['./icon.component.scss'],
})
export class IconComponent implements OnInit {
	@Input() name: string = '';
	@Input() width: string | undefined;
	@Input() height: string | undefined;

	protected svg: SafeHtml | undefined;

	constructor(private readonly sanitizer: DomSanitizer) {}

	ngOnInit(): void {
		if ((AppIcons as any)[this.name]) {
			let svgString = (AppIcons as any)[this.name];

			if (this.height) {
				svgString = svgString.replace(/height="\d+/,'height="' + this.height)
			}

			if (this.width) {
				svgString = svgString.replace(/width="\d+/,'width="' + this.width)
			}

			this.svg = this.sanitizer.bypassSecurityTrustHtml(svgString);
		}
	}
}
