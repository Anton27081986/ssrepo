import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ModalRef } from '@app/core/modal/modal.ref';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FilesApiService } from '@app/core/api/files.api.service';
import { IUserDto } from '@app/core/models/awards/user-dto';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { WinsApiService } from '@app/core/api/wins-api.service';
import { VictoryEventEnum, VictoryRootService } from '@app/components/victory/victory-root.service';
import { Subscription } from 'rxjs';
import { AddVictoryModalResultComponent } from '@app/components/victory/modal/add-victory-modal-result/add-victory-modal-result.component';
import { ModalService } from '@app/core/modal/modal.service';

@UntilDestroy()
@Component({
	selector: 'app-add-victory-modal',
	templateUrl: './add-victory-modal.component.html',
	styleUrls: ['./add-victory-modal.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddVictoryModalComponent {
	protected formGroup: FormGroup<AddVictoryForm>;

	public toUsers: IUserDto[] = [];
	protected subscription: Subscription = new Subscription();

	constructor(
		private readonly modalRef: ModalRef,
		private readonly _formBuilder: FormBuilder,
		private readonly filesApiService: FilesApiService,
		private readonly apiService: WinsApiService,
		private readonly victoryRootService: VictoryRootService,
		private readonly modalService: ModalService,
	) {
		this.formGroup = this._formBuilder.group<AddVictoryForm>({
			text: this._formBuilder.nonNullable.control('', Validators.required),
			userIds: this._formBuilder.nonNullable.control([]),
			productIds: this._formBuilder.nonNullable.control([]),
		});
	}

	protected close() {
		this.modalRef.close();
	}

	public getProducts(products: IDictionaryItemDto[]) {
		const productIds = products.map(prod => prod.id);

		this.formGroup.controls.productIds.setValue(productIds);
	}

	// Пока под вопросом
	// protected uploadFile(event: Event) {
	// 	const element = event.currentTarget as HTMLInputElement;
	// 	const fileList: FileList | null = element.files;
	//
	// 	if (!fileList) {
	// 		return;
	// 	}
	//
	// 	Array.from(fileList).forEach(file => {
	// 		const reader = new FileReader();
	//
	// 		reader.onload = () => {
	// 			// this.filesApiService.uploadFile(file);
	// 		};
	//
	// 		reader.readAsDataURL(file);
	// 	});
	// }

	submit() {
		const userIds = this.toUsers.map(user => user.id!);

		if (userIds.length) {
			this.formGroup.controls.userIds.setValue(userIds);
		}
		if (this.formGroup.valid) {
			this.subscription.add(
				this.apiService
					.addWins(
						this.formGroup.get('text')?.value!,
						this.formGroup.get('userIds')?.value!,
						this.formGroup.get('productIds')?.value!,
					)
					.subscribe(() => {
						this.modalRef.close();
						this.victoryRootService.event$.next({
							type: VictoryEventEnum.victoryCreated,
						});
						this.modalService.open(AddVictoryModalResultComponent);
					}),
			);
		}
	}
}

export interface AddVictoryForm {
	text: FormControl<string>;
	userIds: FormControl<number[]>;
	productIds: FormControl<number[]>;
}
