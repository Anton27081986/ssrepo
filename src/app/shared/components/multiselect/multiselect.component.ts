import {
	ChangeDetectorRef,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	ViewChild,
} from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { IFilterOption } from '@app/shared/components/filters/filters.component';
import { CaptionComponent } from '@app/shared/components/typography/caption/caption.component';
import { TextComponent } from '@app/shared/components/typography/text/text.component';
import { IconComponent } from '@app/shared/components/icon/icon.component';

export type SearchType =
	| 'user'
	| 'client'
	| 'tovs'
	| 'contractor'
	| 'contract'
	| 'tovGroups';

@UntilDestroy()
@Component({
	selector: 'ss-multiselect',
	templateUrl: './multiselect.component.html',
	styleUrls: ['./multiselect.component.scss'],
	imports: [CaptionComponent, TextComponent, IconComponent],
	standalone: true,
})
export class MultiselectComponent {
	@Input()
	public label: string | undefined;

	@Input()
	public size: 'large' | 'medium' = 'medium';

	@Input()
	public placeholder: string | undefined;

	@Input()
	public options: IFilterOption[] = [];

	@Output()
	public getSelected = new EventEmitter<any>();

	public isOptionsVisible = false;

	@ViewChild('optionsEl')
	public optionsEl!: ElementRef;

	constructor(private readonly changeDetector: ChangeDetectorRef) {}

	public changeState(e: Event) {
		e.stopPropagation();
		this.isOptionsVisible = !this.isOptionsVisible;
		this.changeDetector.detectChanges();

		if (this.isOptionsVisible) {
			this.optionsEl.nativeElement.scrollIntoView(false);
		}
	}

	public onSelect(id: number) {
		const option = this.options?.find((option) => option.id === id);

		if (option) {
			option.checked = !option.checked;
		}

		this.getSelected.emit(this.getSelectedOptions());
	}

	getSelectedOptions() {
		return this.options?.filter((option) => option.checked) || null;
	}
}
