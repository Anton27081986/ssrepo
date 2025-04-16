import { Component, HostBinding, Input } from '@angular/core';
import { TextComponent } from '@app/shared/components/typography/text/text.component';
import { CaptionComponent } from '@app/shared/components/typography/caption/caption.component';

@Component({
	selector: 'ss-empty-data-page',
	templateUrl: './empty-data-page.component.html',
	styleUrls: ['./empty-data-page.component.scss'],
	imports: [TextComponent, CaptionComponent],
	standalone: true,
})
export class EmptyDataPageComponent {
	@HostBinding('style.width')
	@Input()
	public width = '100px';

	@HostBinding('style.height')
	@Input()
	public height = '100px';

	@Input()
	public isNotFound = false;
}
