import {
	AfterViewInit,
	Component,
	ElementRef,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { AppIcons } from '@app/core/icons';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
	selector: 'ss-icon',
	templateUrl: './icon.component.html',
	styleUrls: ['./icon.component.scss'],
})
export class IconComponent implements OnInit, OnChanges, AfterViewInit {
	@Input() public name: string = '';
	@Input() public width: string | undefined;
	@Input() public height: string | undefined;
	@ViewChild('svgIcon') public svgIcon!: ElementRef;

	protected svg: SafeHtml | undefined;

	public constructor(private readonly sanitizer: DomSanitizer) {}

	ngAfterViewInit() {
		this.svgIcon.nativeElement.setAttribute(
			'style',
			`width: ${this.width}px; height: ${this.height}px`,
		);
	}

	public ngOnChanges(simple: SimpleChanges) {
		if (simple.width || simple.height) {
			this.setIcon();
		}
	}

	public ngOnInit(): void {
		this.setIcon();
	}

	private setIcon() {
		if ((AppIcons as any)[this.name]) {
			const svgString = (AppIcons as any)[this.name];

			this.svg = this.sanitizer.bypassSecurityTrustHtml(svgString);
		}
	}
}
