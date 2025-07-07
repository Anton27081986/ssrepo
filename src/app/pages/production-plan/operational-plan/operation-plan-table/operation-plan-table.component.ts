import {
	ChangeDetectionStrategy,
	Component,
	effect,
	inject,
	input,
	InputSignal,
	OnInit,
} from '@angular/core';
import {
	Align,
	ButtonComponent,
	ButtonType,
	CheckboxComponent,
	Colors,
	DraggableItemDirective,
	DropdownItemComponent,
	DropdownListComponent,
	ExtraSize,
	HintComponent,
	HintType,
	IconComponent,
	IconType,
	LoadPaginationComponent,
	PopoverTriggerForDirective,
	SsTableState,
	TableCellDirective,
	TableDirective,
	TableHeadDirective,
	TableThGroupComponent,
	TdComponent,
	TextComponent,
	TextType,
	TextWeight,
	ThComponent,
	TrComponent,
	UtilityButtonComponent,
} from '@front-library/components';
import { FiltersTableCanvasComponent } from '@app/pages/production-plan/component-and-service-for-lib/filters-table-pagination-canvas/filters-table-canvas.component';
import { FiltersTriggerButtonComponent } from '@app/pages/production-plan/component-and-service-for-lib/filters-trigger-button/filters-trigger-button.component';
import { AsyncPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { generateColumnOperationPlanConfig } from '@app/pages/production-plan/operational-plan/operation-plan-table/generate-column-oper-plan-config';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { IndicatorChecklistPopupComponent } from '@app/pages/production-plan/component-and-service-for-lib/indicator-checklist-popup/indicator-checklist-popup.component';
import { OperationPlanPopupService } from '@app/pages/production-plan/service/operation-plan.popup.service';
import { OperationPlanService } from '@app/pages/production-plan/service/operation-plan.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { OperationPlanTableTbodyComponent } from '@app/pages/production-plan/operational-plan/operation-plan-table/operation-plan-table-tbody/operation-plan-table-tbody.component';
import {
	OperationPlanItem,
	OperationPlanRequest,
	Pagination,
} from '@app/core/models/production-plan/operation-plan';
import { UpdateRawMaterialsData } from '@app/pages/production-plan/modal/modal-update-raw-materials/modal-update-raw-materials.component';
import { OperationPlanState } from '@app/pages/production-plan/service/operation-plan.state';

@Component({
	selector: 'app-operation-plan-table',
	standalone: true,
	imports: [
		ButtonComponent,
		DropdownItemComponent,
		PopoverTriggerForDirective,
		DropdownListComponent,
		NgFor,
		IconComponent,
		TableDirective,
		TableThGroupComponent,
		ThComponent,
		CheckboxComponent,
		ReactiveFormsModule,
		TextComponent,
		TableHeadDirective,
		IndicatorChecklistPopupComponent,
		DatePipe,
		OperationPlanTableTbodyComponent,
		HintComponent,
		UtilityButtonComponent,
	],
	templateUrl: './operation-plan-table.component.html',
	styleUrl: './operation-plan-table.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class OperationPlanTableComponent {
	private readonly tableStateService = inject(SsTableState);

	private readonly operationPlanPopup = inject(OperationPlanPopupService);

	private readonly operationPlanService = inject(OperationPlanService);

	private readonly operationPlanState = inject(OperationPlanState);

	public planItems: InputSignal<OperationPlanItem[]> = input.required();

	public days: InputSignal<string[]> = input.required();

	public total: InputSignal<number> = input.required();

	public totalItems: InputSignal<number> = input.required();

	public readonly visibleColumnsIds =
		this.tableStateService.visibleColumnsIds;

	public readonly visibleColumns = this.tableStateService.visibleColumns;

	public readonly masterCheckboxCtrl =
		this.tableStateService.getMasterCheckboxCtrl();

	public readonly data = this.tableStateService.data;

	public readonly rowCheckboxes = this.tableStateService.getRowCheckboxes();

	protected readonly Colors = Colors;
	protected readonly TextWeight = TextWeight;
	protected readonly TextType = TextType;
	protected readonly Align = Align;

	public popupVisible = false;

	protected get getSelectedElemCount(): number {
		return this.rowCheckboxes.value.filter((ctrl) => ctrl).length;
	}

	constructor() {
		toSignal(
			this.masterCheckboxCtrl.valueChanges.pipe(
				tap((value: boolean | null) =>
					this.tableStateService.onMasterCheckboxChange(value),
				),
			),
		);

		toSignal(
			this.rowCheckboxes.valueChanges.pipe(
				tap((value) => {
					const count = value.filter((ctrl) => ctrl).length;
					if (count > 0 && !this.popupVisible) {
						this.popupVisible = true;
					}

					this.tableStateService.updateMasterCheckboxState();
				}),
			),
		);

		effect(() => {
			const columnOperPlanConfig = generateColumnOperationPlanConfig(
				this.planItems(),
				this.days(),
			);

			this.tableStateService.initialize(
				this.planItems(),
				columnOperPlanConfig,
			);
		});
	}

	public isSubColumn(columnId: string): boolean {
		return this.visibleColumns().some(
			(column) =>
				column.subColumns && column.subColumns.includes(columnId),
		);
	}

	public getMasterCheckboxIndeterminate(): boolean {
		return this.tableStateService.isMasterCheckboxIndeterminate();
	}

	public formatColumnName(name: string): string {
		if (name.match(/^\d{2}-\d{2}$/)) {
			const [month, day] = name.split('-');

			return `${day}.${month}`;
		}

		return name;
	}

	public getSubColumnName(subColumnId: string): string {
		if (subColumnId.startsWith('planQuantity')) {
			return 'План';
		}

		if (subColumnId.startsWith('factQuantity')) {
			return 'Факт';
		}

		return subColumnId;
	}

	public openCalculationOfRawMaterials(
		isColumn: boolean = false,
		day: string | undefined = undefined,
		columnName: string | undefined = undefined,
	) {
		let rawFilter: (OperationPlanRequest & Pagination) | undefined =
			this.operationPlanState.filterValueStore$.value!;
		let tovIds: number[] | undefined = this.getSelectedIds();

		let checkDay = day;

		let total = tovIds.length;
		if (isColumn) {
			rawFilter = undefined;
			tovIds = undefined;
			total = this.total();
			checkDay = this.days().find((day) => {});
		}

		const param: UpdateRawMaterialsData = {
			day: checkDay,
			tovIds: tovIds,
			filterParams: rawFilter,
			weekId: this.operationPlanState.weekId$.value!,
			total: total,
		};
		this.operationPlanPopup.openCalculationOfRawMaterials(param);
	}

	private getSelectedIds(): number[] {
		return this.data()
			.map((row, idx) => (this.rowCheckboxes.value[idx] ? row.id : null))
			.filter((id): id is number => id !== null);
	}

	protected deleteItemsTov() {
		this.operationPlanService
			.deleteItemsTov(this.getSelectedIds())
			.pipe(untilDestroyed(this))
			.subscribe();
	}

	public openWindowWithPost(
		url: string = ' https://ssnab.it/Mfs/Receipts/ReceipTermsTree',
	) {
		// Create a new form element
		let form = document.createElement('form');
		form.method = 'POST';
		form.action = url;
		form.target = 'NewWindow'; // Name of the target window/tab
		form.id = 'ReceipTermsTree';

		// // Add hidden input fields for each data parameter
		// for (var key in data) {
		// 	if (data.hasOwnProperty(key)) {
		// 		var input = document.createElement('input');
		// 		input.type = 'hidden';
		// 		input.name = key;
		// 		input.value = data[key];
		// 		form.appendChild(input);
		// 	}
		// }

		var input1 = document.createElement('input');
		input1.type = 'hidden';
		input1.name = 'D_DOC'; // выбранная дата в формате 30.06.2025
		input1.value = '30.06.2025';
		form.appendChild(input1);
		var input2 = document.createElement('input');
		input2.type = 'hidden';
		input2.name = 'gps'; // ?
		input2.value = '';
		form.appendChild(input2);
		var input3 = document.createElement('input');
		input3.type = 'hidden';
		input3.name = 'TOV'; // наименование tp т.е пустой
		input3.value = '';
		form.appendChild(input3);
		var input4 = document.createElement('input');
		input4.type = 'hidden';
		input4.name = 'FACTORY_ID'; // productionFactoryId
		input4.value = '';
		form.appendChild(input4);
		var input5 = document.createElement('input');
		input5.type = 'hidden';
		input5.name = 'SECTION_ID'; // Участки
		input5.value = '';
		form.appendChild(input5);
		var input6 = document.createElement('input');
		input6.type = 'hidden';
		input6.name = 'MPO_ID'; // PlanEconomicUserIds  - только 1
		input6.value = '';
		form.appendChild(input6);
		var input7 = document.createElement('input');
		input7.type = 'hidden';
		input7.name = 'PRE_BUNK_ID'; // ''
		input7.value = '';
		form.appendChild(input7);
		var input8 = document.createElement('input');
		input8.type = 'hidden';
		input8.name = 'QUANTITY'; // ?
		input8.value = '0';
		form.appendChild(input8);
		// Append the form to the document body (it will not be visible)
		document.body.appendChild(form);

		var features =
			'resizable= yes; status= no; scroll= no; help= no; center= yes; width = 460; height = 200; menubar = no; directories = no; location = no; modal = yes';

		// Open the new window/tab
		var newWindow = window.open('', 'NewWindow', features);
		form.submit();
		// Check if the window was successfully opened (e.g., not blocked by a popup blocker)
		if (newWindow) {
			// Submit the form to the new window
		} else {
			alert('Pop-ups must be enabled to open the new window.');
		}

		// Remove the form from the document body after submission
		document.body.removeChild(form);
	}

	protected popupCloseEmit() {
		this.tableStateService.onMasterCheckboxChange(false);
	}

	protected readonly ButtonType = ButtonType;
	protected readonly ExtraSize = ExtraSize;
	protected readonly IconType = IconType;
	protected readonly HintType = HintType;
}
