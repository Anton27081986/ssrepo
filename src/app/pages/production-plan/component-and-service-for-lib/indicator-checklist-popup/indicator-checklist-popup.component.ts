import {
	Component,
	input,
	InputSignal,
	Output,
	EventEmitter,
	OnChanges,
	SimpleChanges,
} from '@angular/core';
import {
	ButtonComponent,
	ButtonType,
	CheckboxComponent,
	ExtraSize,
	IconType,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-library/components';

@Component({
	selector: 'ss-lib-indicator-checklist-popup',
	standalone: true,
	imports: [ButtonComponent, CheckboxComponent, TextComponent],
	templateUrl: './indicator-checklist-popup.component.html',
	styleUrl: './indicator-checklist-popup.component.scss',
})
export class IndicatorChecklistPopupComponent implements OnChanges {
	count: InputSignal<number> = input.required();
	total: InputSignal<number> = input.required();
	@Output() closed = new EventEmitter<void>();

	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly ButtonType = ButtonType;
	protected readonly IconType = IconType;
	protected readonly ExtraSize = ExtraSize;

	animationState: 'visible' | 'hide' = 'visible';

	ngOnChanges(_changes: SimpleChanges): void {
		if (this.count() > 0 && this.animationState === 'hide') {
			this.animationState = 'visible';
		}
		if (this.count() <= 0 && this.animationState === 'visible') {
			this.animationState = 'hide';
		}
	}

	onAnimationDone(): void {
		if (this.animationState === 'hide' && this.count() <= 0) {
			this.closed.emit();
		}
	}

	close(): void {
		if (this.animationState === 'visible') {
			this.animationState = 'hide';
			this.closed.emit();
		}
	}
}
