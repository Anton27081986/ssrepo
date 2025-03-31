import { Component, Input } from '@angular/core';
import { CaptionComponent } from '@app/shared/components/typography/caption/caption.component';

@Component({
	selector: 'ss-link',
	templateUrl: './link.component.html',
	styleUrls: ['./link.component.scss'],
	imports: [CaptionComponent],
	standalone: true,
})
export class LinkComponent {
	@Input()
	public href: string | undefined | null;
}
