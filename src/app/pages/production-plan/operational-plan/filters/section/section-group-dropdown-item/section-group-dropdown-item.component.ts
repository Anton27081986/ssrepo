import { UntilDestroy } from '@ngneat/until-destroy';
import {
	Component,
	EventEmitter,
	input,
	InputSignal,
	OnInit,
	Output,
	signal,
	WritableSignal,
} from '@angular/core';
import {
	CheckboxComponent,
	Colors,
	DropdownItemComponent,
	IconComponent,
	IconType,
	TextComponent,
} from '@front-library/components';
import { ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { SectionItem } from '@app/pages/production-plan/operational-plan/filters/section/section-filter.component';

@UntilDestroy()
@Component({
	selector: 'app-section-group-dropdown-item',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		TextComponent,
		NgIf,
		DropdownItemComponent,
		CheckboxComponent,
		NgFor,
		IconComponent,
	],
	templateUrl: '/section-group-dropdown-item.component.html',
	styleUrl: 'section-group-dropdown-item.component.scss',
})
export class SectionGroupDropdownItemComponent implements OnInit {
	public sectionItem: InputSignal<SectionItem> = input.required();
	public expanded: InputSignal<boolean> = input.required();
	public writableExpanded: WritableSignal<boolean> = signal(false);

	@Output()
	public toggleEmit: EventEmitter<SectionItem> =
		new EventEmitter<SectionItem>();

	@Output()
	public toggleParentEmit: EventEmitter<SectionItem> =
		new EventEmitter<SectionItem>();

	protected readonly IconType = IconType;

	protected readonly Colors = Colors;
	public ngOnInit(): void {
		this.writableExpanded.set(this.expanded());
	}

	protected toggleItemEmit(item: SectionItem): void {
		this.toggleEmit.emit(item);
	}

	protected toggleParent(): void {
		this.toggleParentEmit.emit(this.sectionItem());
	}
}
