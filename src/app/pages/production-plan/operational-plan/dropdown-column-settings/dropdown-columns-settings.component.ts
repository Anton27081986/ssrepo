import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
} from '@angular/core';
import {
	ButtonComponent,
	ButtonType,
	CheckboxComponent,
	Colors,
	DropdownGroupDirective,
	DropdownItemComponent,
	DropdownListComponent,
	IconComponent,
	IconType,
	PopoverTriggerForDirective,
	SsTableState,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-library/components';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { TableColumnConfig } from '@front-library/components/lib/components/table/models';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IconPosition } from '@front-components/components';

@Component({
	selector: 'app-dropdown-columns-settings',
	standalone: true,
	imports: [
		ButtonComponent,
		PopoverTriggerForDirective,
		DropdownListComponent,
		DropdownGroupDirective,
		CdkDropList,
		DropdownItemComponent,
		CdkDrag,
		CheckboxComponent,
		ReactiveFormsModule,
		TextComponent,
		IconComponent,
	],
	templateUrl: './dropdown-columns-settings.component.html',
	styleUrl: './dropdown-columns-settings.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [],
})
export class DropdownColumnsSettingsComponent {
	private readonly tableStateService = inject(SsTableState);

	public readonly dropdownColumns = this.tableStateService.dropdownColumns;

	public readonly dropdownColumnsVisible = computed(() =>
		this.dropdownColumns().filter((item) => item.visible)
	);

	public readonly dropdownColumnsUnVisible = computed(() =>
		this.dropdownColumns().filter((item) => !item.visible)
	);

	protected readonly ButtonType = ButtonType;
	protected readonly IconPosition = IconPosition;
	protected readonly IconType = IconType;
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly Colors = Colors;
	protected onDropdownItemDrop(
		event: CdkDragDrop<TableColumnConfig[]>
	): void {
		this.tableStateService.onDropdownItemDrop(
			event,
			this.dropdownColumnsVisible(),
			this.dropdownColumnsUnVisible()
		);
	}

	public updateColumnVisibility(column: TableColumnConfig): void {
		const isVisible = !column.visible;

		this.tableStateService.updateColumnVisibility(column, isVisible);
	}

	public getControlForColumn(column: TableColumnConfig): FormControl {
		return this.tableStateService.getControlForColumn(column);
	}
}
