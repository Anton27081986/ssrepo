import {
	ChangeDetectionStrategy,
	Component,
	HostBinding,
	Input,
	ViewEncapsulation,
} from '@angular/core';

@Component({
	selector: 'ss-divider',
	template: `
		<div
			class="ss-divider"
			[class.ss-divider--horizontal]="direction === 'horizontal'"
			[class.ss-divider--vertical]="direction === 'vertical'"
		></div>
	`,
	styleUrls: ['ss-divider.component.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true
})
export class SsDividerComponent {
	@Input() public size: number | null = null;
	@Input() public direction: 'vertical' | 'horizontal' = 'horizontal';

	@HostBinding('style')
	public get style(): { [key: string]: string } {
		return { [this._property]: this._cssSize };
	}

	private get _property(): string {
		return this.direction === 'vertical' ? 'height' : 'width';
	}

	private get _cssSize(): string {
		if (this.size !== null) {
			return `${this.size.toString()}px`;
		}

		return this.direction === 'vertical' ? '24px' : '100%';
	}
}
