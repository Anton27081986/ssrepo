import {
	ChangeDetectionStrategy,
	Component,
	input,
	InputSignal,
} from '@angular/core';
import {
	CheckboxComponent,
	Colors,
	ExtraSize,
	IconComponent,
	IconType,
	PopoverTriggerForDirective,
	TextComponent,
	TextType,
	TextWeight,
} from '@front-library/components';
import { NgComponentOutlet, NgIf } from '@angular/common';
import { rotateAnimation } from '@app/core/animations';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TreeNode } from '@app/pages/production-plan/operational-plan/filters/section/tree-node';

@Component({
	selector: 'ss-lib-dropdown-group-filter-items',
	standalone: true,
	imports: [
		IconComponent,
		CheckboxComponent,
		TextComponent,
		ReactiveFormsModule,
		NgIf,
	],
	templateUrl: './dropdown-filter-group-items.component.html',
	styleUrl: './dropdown-filter-group-items.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [rotateAnimation],
})
export class DropdownFilterGroupItemsComponent {
	public treeNode: InputSignal<TreeNode> = input.required();
	protected readonly Colors = Colors;
	protected readonly ExtraSize = ExtraSize;
	protected readonly TextType = TextType;
	protected readonly TextWeight = TextWeight;
	protected readonly IconType = IconType;

	public expand() {
		this.treeNode().expanded = !this.treeNode().expanded;
	}

	public checkItems(controlCheckAll: FormControl<boolean | null>) {
		controlCheckAll.setValue(!controlCheckAll.value);
	}
}
