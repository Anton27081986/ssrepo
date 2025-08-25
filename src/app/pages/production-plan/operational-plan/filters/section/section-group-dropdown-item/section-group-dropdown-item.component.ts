import { UntilDestroy } from '@ngneat/until-destroy';
import {
	ChangeDetectionStrategy,
	Component,
	effect,
	EventEmitter,
	input,
	InputSignal,
	model,
	ModelSignal,
	OnInit,
	Output,
	signal,
	WritableSignal,
} from '@angular/core';
import {
	CheckboxComponent,
	Colors,
	DividerComponent,
	DropdownItemComponent,
	FieldCtrlDirective,
	FormFieldComponent,
	IconComponent,
	IconType,
	InputComponent,
	ScrollbarComponent,
	SpinnerComponent,
	TextComponent,
} from '@front-library/components';
import { ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { SectionItem } from '@app/pages/production-plan/operational-plan/filters/section/section-filter.component';

@UntilDestroy()
@Component({
	selector: 'app-section-group-dropdown-item',
	standalone: true,
	imports: [
		FieldCtrlDirective,
		FormFieldComponent,
		InputComponent,
		ReactiveFormsModule,
		AsyncPipe,
		TextComponent,
		NgIf,
		SpinnerComponent,
		DropdownItemComponent,
		CheckboxComponent,
		NgFor,
		ScrollbarComponent,
		IconComponent,
		DividerComponent,
	],
	templateUrl: '/section-group-dropdown-item.component.html',
	styleUrl: 'section-group-dropdown-item.component.scss',
})
export class SectionGroupDropdownItemComponent implements OnInit {
	public sectionItem: InputSignal<SectionItem> = input.required();
	public expanded: InputSignal<boolean> = input.required();
	public writableExpanded: WritableSignal<boolean> = signal(false);

	@Output() toggleEmit: EventEmitter<SectionItem> =
		new EventEmitter<SectionItem>();

	@Output() toggleParentEmit: EventEmitter<SectionItem> =
		new EventEmitter<SectionItem>();

	protected readonly IconType = IconType;

	ngOnInit() {
		this.writableExpanded.set(this.expanded());
	}

	protected toggleItemEmit(item: SectionItem) {
		this.toggleEmit.emit(item);
	}

	protected toggleParent() {
		this.toggleParentEmit.emit(this.sectionItem());
	}

	protected readonly Colors = Colors;
}
