import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ModalRef } from '@app/core/modal/modal.ref';
import {FormBuilder, FormControl, FormGroup, MaxValidator, ReactiveFormsModule, Validators} from '@angular/forms';
import { FileBucketsEnum, FilesApiService } from '@app/core/api/files.api.service';
import { IUserDto } from '@app/core/models/awards/user-dto';
import { IDictionaryItemDto } from '@app/core/models/company/dictionary-item-dto';
import { WinsApiService } from '@app/core/api/wins-api.service';
import { VictoryEventEnum, VictoryRootService } from '@app/components/victory/victory-root.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AddVictoryModalResultComponent } from '@app/components/victory/modal/add-victory-modal-result/add-victory-modal-result.component';
import { ModalService } from '@app/core/modal/modal.service';
import { IAttachmentDto } from '@app/core/models/notifications/attachment-dto';
import { filterTruthy } from '@app/core/facades/client-proposals-facade.service';
import {HeadlineComponent} from "@app/shared/components/typography/headline/headline.component";
import {IconComponent} from "@app/shared/components/icon/icon.component";
import {SsDividerComponent} from "@app/shared/components/ss-divider/ss-divider.component";
import {TextareaComponent} from "@app/shared/components/textarea/textarea.component";
import {ChipsUserSearchComponent} from "@app/shared/components/inputs/chips-user-search/chips-user-search.component";
import {ChipsSearchComponent} from "@app/shared/components/inputs/chips-search/chips-search.component";
import {CaptionComponent} from "@app/shared/components/typography/caption/caption.component";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {AttachmentComponent} from "@app/shared/components/attachment/attachment.component";
import {ButtonComponent} from "@app/shared/components/buttons/button/button.component";

@UntilDestroy()
@Component({
	selector: 'app-add-victory-modal',
	templateUrl: './add-victory-modal.component.html',
	styleUrls: ['./add-victory-modal.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		HeadlineComponent,
		IconComponent,
		SsDividerComponent,
		ReactiveFormsModule,
		TextareaComponent,
		ChipsUserSearchComponent,
		ChipsSearchComponent,
		CaptionComponent,
		NgIf,
		AsyncPipe,
		AttachmentComponent,
		NgForOf,
		ButtonComponent
	],
	standalone: true
})
export class AddVictoryModalComponent {
	protected formGroup: FormGroup<AddVictoryForm>;

	public toUsers: IUserDto[] = [];
	protected subscription: Subscription = new Subscription();

	protected readonly victoryFiles = new BehaviorSubject<IAttachmentDto[] | null>(null);

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

	public deleteFile(id: string) {
		this.filesApiService
			.deleteFile(id)
			.pipe(untilDestroyed(this))
			.subscribe(() => {
				if (this.victoryFiles.value) {
					this.victoryFiles.next(this.victoryFiles.value.filter(file => file.id !== id));
				}
			});
	}

	protected uploadFile(event: Event) {
		const element = event.currentTarget as HTMLInputElement;
		const fileList: FileList | null = element.files;

		if (!fileList) {
			return;
		}

		Array.from(fileList).forEach(file => {
			const reader = new FileReader();

			reader.onload = () => {
				this.filesApiService
					.uploadFile(FileBucketsEnum.Attachments, file)
					.pipe(filterTruthy())
					.subscribe(file => {
						this.victoryFiles.next(
							this.victoryFiles.value ? [...this.victoryFiles.value, file] : [file],
						);
					});
			};

			reader.readAsDataURL(file);
		});
	}

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
						this.victoryFiles.value ? this.victoryFiles.value.map(item => item.id) : [],
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
