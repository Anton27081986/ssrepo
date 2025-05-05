import {
	ChangeDetectionStrategy,
	Component,
	inject,
	Signal,
} from '@angular/core';
import {
	ButtonComponent,
	ButtonType,
	ExtraSize,
	IconType,
	InputComponent,
	ModalActionApplyComponent,
	ModalComponent,
	ModalRef,
	Shape,
} from '@front-library/components';
import { OperationPlanService } from '@app/pages/production-plan/service/operation-plan.service';
import { ManufacturingTovs } from '@app/core/models/operation-plan/manufacturing-tovs';
import { toSignal } from '@angular/core/rxjs-interop';
import { InputType } from '@front-components/components';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-add-manufactures-popup',
	standalone: true,
	imports: [
		ModalComponent,
		ModalActionApplyComponent,
		ButtonComponent,
		InputComponent,
		ReactiveFormsModule,
	],
	templateUrl: './add-manufactures-popup.component.html',
	styleUrl: './add-manufactures-popup.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddManufacturesPopupComponent {
	protected readonly ExtraSize = ExtraSize;
	protected readonly Shape = Shape;
	protected readonly IconType = IconType;

	private readonly popup = inject(ModalRef);
	private readonly operationPlanService = inject(OperationPlanService);

	private readonly tovs: Signal<ManufacturingTovs[]> = toSignal(
		this.operationPlanService.getManufacturingTov(),
		{ initialValue: [] },
	);

	protected add() {}

	protected close() {
		this.popup.close();
	}

	protected readonly ButtonType = ButtonType;
	protected readonly InputType = InputType;
}
